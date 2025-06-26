import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { type Address } from 'viem';

import { useLidoSDK } from 'modules/web3';
import { fetchReportMerkle } from 'modules/vaults/report';

import {
  getLazyOracleContract,
  getDashboardContract,
  getStakingVaultContract,
  getVaultHubContract,
} from '../contracts';
import { DisplayableError, VaultNotDashboard, vaultQueryKeys } from '../consts';
import { isDashboard } from '../utils/is-dashboard';

import type { VaultBaseInfo } from '../types';

export const useBaseVaultData = (vaultAddress: Address | undefined) => {
  const { publicClient } = useLidoSDK();
  const base = vaultQueryKeys(vaultAddress).stateBase;
  return useQuery<VaultBaseInfo>({
    queryKey: [...base, 'base-vault-data'] as const,
    enabled: !!vaultAddress,
    staleTime: 5 * 60_000, // cache available for 5 minutes,
    refetchInterval: 60_000, // refetch every minute,
    retry(failureCount, error) {
      // retry only if the error is not our custom error
      return failureCount < 3 && !(error instanceof DisplayableError);
    },
    queryFn: async () => {
      invariant(vaultAddress, '[useBaseVaultData] vaultAddress is not defined');

      // TODO:
      // - check if dashboard is dashboard

      const hub = getVaultHubContract(publicClient);
      const lazyOracle = getLazyOracleContract(publicClient);
      const vault = getStakingVaultContract(vaultAddress, publicClient);

      const [
        nodeOperator,
        withdrawalCredentials,
        connection,
        isReportFresh,
        latestVaultReport,
        latestHubReport,
      ] = await Promise.all([
        vault.read.nodeOperator(),
        vault.read.withdrawalCredentials(),
        hub.read.vaultConnection([vaultAddress]),
        hub.read.isReportFresh([vaultAddress]),
        hub.read.latestReport([vaultAddress]),
        lazyOracle.read.latestReportData(),
      ]);

      const [
        latestHubReportTimestamp,
        latestHubReportRoot,
        latestHubReportCID,
      ] = latestHubReport;

      const isReportAvailable =
        latestHubReportTimestamp > latestVaultReport.timestamp;

      // we might not have a report even when fresh is not true
      const report = isReportAvailable
        ? await fetchReportMerkle(
            publicClient.chain.id,
            latestHubReport[2],
            vaultAddress,
          ).catch(() => null)
        : null;

      const isReportMissing = !report && !isReportFresh;

      if (!(await isDashboard(publicClient, connection.owner))) {
        throw new VaultNotDashboard();
      }

      const dashboard = getDashboardContract(connection.owner, publicClient);

      return {
        address: vaultAddress,
        vault,
        dashboard,
        hub,
        nodeOperator,
        withdrawalCredentials,
        report,
        hubReport: {
          root: latestHubReportRoot,
          cid: latestHubReportCID,
          timestamp: latestHubReportTimestamp,
        },
        isReportFresh,
        isReportMissing,
        ...connection,
      };
    },
  });
};
