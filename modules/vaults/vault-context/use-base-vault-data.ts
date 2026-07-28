import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { type Address, zeroAddress } from 'viem';
import { LidoSDKVaultEntity } from '@lidofinance/lido-ethereum-sdk/stvault';

import { useLidoSDK } from 'modules/web3';

import {
  fetchReport,
  checkIsDashboard,
  VaultOwnerNotDashboardError,
} from 'modules/vaults';
import { BLOCK_POLLING_INTERVAL } from 'config/groups/web3';
import { awaitWithTimeout } from 'utils/await-with-timeout';

import {
  DisplayableError,
  vaultQueryKeys,
  VAULT_REPORT_REFETCH_INTERVAL_MS,
} from '../consts';

import type { VaultBaseInfo } from '../types';

const waitForRpcBlock = async (
  publicClient: any,
  targetBlock: bigint,
): Promise<bigint> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const latestRpcBlock = await publicClient.getBlockNumber({
      cacheTime: 0,
    });

    if (latestRpcBlock >= targetBlock) {
      return latestRpcBlock;
    }
    await new Promise((resolve) => setTimeout(resolve, BLOCK_POLLING_INTERVAL));
  }
};

export const useBaseVaultData = (
  vaultAddress: Address | undefined,
  latestTxBlock: bigint | undefined,
) => {
  const { publicClient, vaultModule } = useLidoSDK();
  const base = vaultQueryKeys(vaultAddress).stateBase;
  return useQuery<VaultBaseInfo>({
    queryKey: [...base, 'base-vault-data', { latestTxBlock }] as const,
    enabled: !!vaultAddress,
    refetchInterval: VAULT_REPORT_REFETCH_INTERVAL_MS, // 30 mins
    retry(failureCount, error) {
      // retry only if the error is not our custom error
      return failureCount < 3 && !(error instanceof DisplayableError);
    },
    queryFn: async () => {
      invariant(vaultAddress, '[useBaseVaultData] vaultAddress is not defined');

      const vaultEntity = new LidoSDKVaultEntity({
        bus: vaultModule,
        vaultAddress,
        skipDashboardCheck: true,
      });

      const blockNumber = await awaitWithTimeout(
        waitForRpcBlock(publicClient, latestTxBlock ?? 0n),
        VAULT_REPORT_REFETCH_INTERVAL_MS,
      );

      const DEFAULT_CALL_OPTIONS = { blockNumber };

      const [hub, lazyOracle, vaultFactory, vault] = await Promise.all([
        vaultModule.contracts.getContractVaultHub(),
        vaultModule.contracts.getContractLazyOracle(),
        vaultModule.contracts.getContractVaultFactory(),
        vaultEntity.getVaultContract(),
      ]);

      const [
        vaultOwner,
        nodeOperator,
        withdrawalCredentials,
        pendingOwner,
        connection,
        isVaultConnected,
        isPendingDisconnect,
        isReportFresh,
        latestVaultReport,
        latestHubReport,
        isDeployedVault,
      ] = await Promise.all([
        vault.read.owner(DEFAULT_CALL_OPTIONS),
        vault.read.nodeOperator(DEFAULT_CALL_OPTIONS),
        vault.read.withdrawalCredentials(DEFAULT_CALL_OPTIONS),
        vault.read.pendingOwner(DEFAULT_CALL_OPTIONS),
        hub.read.vaultConnection([vaultAddress], DEFAULT_CALL_OPTIONS),
        hub.read.isVaultConnected([vault.address], DEFAULT_CALL_OPTIONS),
        hub.read.isPendingDisconnect([vault.address], DEFAULT_CALL_OPTIONS),
        hub.read.isReportFresh([vaultAddress], DEFAULT_CALL_OPTIONS),
        hub.read.latestReport([vaultAddress], DEFAULT_CALL_OPTIONS),
        lazyOracle.read.latestReportData(DEFAULT_CALL_OPTIONS),
        vaultFactory.read.deployedVaults([vault.address], DEFAULT_CALL_OPTIONS),
      ]);

      const [
        latestHubReportTimestamp,
        latestDataRefSlot,
        latestHubReportRoot,
        latestHubReportCID,
      ] = latestHubReport;

      const isReportAvailable =
        latestHubReportTimestamp > latestVaultReport.timestamp;

      const report = latestHubReportCID
        ? await fetchReport(
            { publicClient },
            { cid: latestHubReportCID, vault: vaultAddress },
          )
        : null;

      // we might not have a report even when fresh is not true
      const isReportMissing = !report && !isReportFresh;

      const supposedDashboardAddress =
        connection.owner !== zeroAddress ? connection.owner : vaultOwner;
      const isDashboard = await checkIsDashboard({
        publicClient,
        vaultModule,
        blockNumber,
        dashboardAddress: supposedDashboardAddress,
      });

      // TODO: reword to support multiple factories
      // if (!isDashboard && isVaultConnected) {}
      if (!isDeployedVault) {
        throw new VaultOwnerNotDashboardError();
      }

      const [operatorGrid, predepositGuarantee, dashboard] = await Promise.all([
        vaultModule.contracts.getContractOperatorGrid(),
        vaultModule.contracts.getContractPredepositGuarantee(),
        vaultEntity.getDashboardContract(),
      ]);

      const group = await operatorGrid.read.group(
        [nodeOperator],
        DEFAULT_CALL_OPTIONS,
      );

      return {
        address: vaultAddress,
        vaultEntity,
        vault,
        vaultOwner,
        dashboard,
        hub,
        nodeOperator,
        pendingOwner,
        withdrawalCredentials,
        report,
        operatorGrid,
        group,
        lazyOracle,
        hubReport: {
          root: latestHubReportRoot,
          refSlot: latestDataRefSlot,
          cid: latestHubReportCID,
          timestamp: latestHubReportTimestamp,
        },
        isReportFresh,
        isReportMissing,
        isVaultDisconnected: !isDashboard,
        isVaultConnected,
        isPendingDisconnect,
        isPendingConnect: !isVaultConnected && isDashboard,
        isReportAvailable,
        isDeployedVault,
        hasPendingOwner: pendingOwner !== zeroAddress,
        predepositGuarantee,
        blockNumber,
        ...connection,
      };
    },
  });
};
