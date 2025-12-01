import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { type Address, zeroAddress } from 'viem';

import { useLidoSDK } from 'modules/web3';
import {
  fetchReport,
  checkIsDashboard,
  VaultOwnerNotDashboardError,
} from 'modules/vaults';

import {
  getLazyOracleContract,
  getDashboardContract,
  getStakingVaultContract,
  getVaultHubContract,
  getOperatorGridContract,
  getPredepositGuaranteeContract,
} from '../contracts';
import {
  DisplayableError,
  vaultQueryKeys,
  VAULT_REPORT_REFETCH_INTERVAL_MS,
} from '../consts';

import type { VaultBaseInfo } from '../types';

export const useBaseVaultData = (vaultAddress: Address | undefined) => {
  const { publicClient } = useLidoSDK();
  const base = vaultQueryKeys(vaultAddress).stateBase;
  return useQuery<VaultBaseInfo>({
    queryKey: [...base, 'base-vault-data'] as const,
    enabled: !!vaultAddress,
    refetchInterval: VAULT_REPORT_REFETCH_INTERVAL_MS,
    retry(failureCount, error) {
      // retry only if the error is not our custom error
      return failureCount < 3 && !(error instanceof DisplayableError);
    },
    queryFn: async () => {
      invariant(vaultAddress, '[useBaseVaultData] vaultAddress is not defined');

      const hub = getVaultHubContract(publicClient);
      const lazyOracle = getLazyOracleContract(publicClient);
      const vault = getStakingVaultContract(vaultAddress, publicClient);

      const [
        vaultOwner,
        nodeOperator,
        withdrawalCredentials,
        connection,
        isVaultConnected,
        isPendingDisconnect,
        isReportFresh,
        latestVaultReport,
        latestHubReport,
        blockNumber,
      ] = await Promise.all([
        vault.read.owner(),
        vault.read.nodeOperator(),
        vault.read.withdrawalCredentials(),
        hub.read.vaultConnection([vaultAddress]),
        hub.read.isVaultConnected([vault.address]),
        hub.read.isPendingDisconnect([vault.address]),
        hub.read.isReportFresh([vaultAddress]),
        hub.read.latestReport([vaultAddress]),
        lazyOracle.read.latestReportData(),
        publicClient.getBlockNumber(),
      ]);

      // TODO: remove after monitoring error with InvalidProof()
      // eslint-disable-next-line no-console
      console.log('getting report data for block:', blockNumber);

      const [
        latestHubReportTimestamp,
        latestDataRefSlot,
        latestHubReportRoot,
        latestHubReportCID,
      ] = latestHubReport;

      const isReportAvailable =
        latestHubReportTimestamp > latestVaultReport.timestamp;

      // we might not have a report even when fresh is not true
      const report = isReportAvailable
        ? await fetchReport(
            { publicClient },
            { cid: latestHubReportCID, vault: vaultAddress },
          )
        : null;

      const isReportMissing = !report && !isReportFresh;

      const supposedDashboardAddress =
        connection.owner !== zeroAddress ? connection.owner : vaultOwner;
      const isDashboard = await checkIsDashboard(
        publicClient,
        supposedDashboardAddress,
      );

      // TODO: reword to support multiple factories
      if (!isDashboard && isVaultConnected) {
        throw new VaultOwnerNotDashboardError();
      }

      const dashboard = getDashboardContract(
        supposedDashboardAddress,
        publicClient,
      );
      const operatorGrid = getOperatorGridContract(publicClient);
      const predepositGuarantee = getPredepositGuaranteeContract(publicClient);

      return {
        address: vaultAddress,
        vault,
        vaultOwner,
        dashboard,
        hub,
        nodeOperator,
        withdrawalCredentials,
        report,
        operatorGrid,
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
        predepositGuarantee,
        blockNumber,
        ...connection,
      };
    },
  });
};
