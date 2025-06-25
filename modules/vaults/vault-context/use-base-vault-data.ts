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
import type { VaultBaseInfo } from '../types';

export const useBaseVaultData = (vaultAddress: Address | undefined) => {
  const { publicClient } = useLidoSDK();
  return useQuery<VaultBaseInfo>({
    queryKey: ['base-vault-data', vaultAddress] as const,
    enabled: !!vaultAddress,
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
        latestHubReportTimestamp,
      ] = await Promise.all([
        vault.read.nodeOperator(),
        vault.read.withdrawalCredentials(),
        hub.read.vaultConnection([vaultAddress]),
        hub.read.isReportFresh([vaultAddress]),
        hub.read.latestReport([vaultAddress]),
        lazyOracle.read.latestReportData(),
        lazyOracle.read.latestReportTimestamp(),
      ]);

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

      const dashboard = getDashboardContract(connection.owner, publicClient);

      return {
        address: vaultAddress,
        vault,
        dashboard,
        hub,
        nodeOperator,
        withdrawalCredentials,
        report: report && {
          ...report,
          timestamp: BigInt(latestVaultReport.timestamp),
        },
        reportCID: latestHubReport[2],
        isReportFresh,
        isReportMissing,
        ...connection,
      };
    },
  });
};
