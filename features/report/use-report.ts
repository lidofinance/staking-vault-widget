/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useEffect, useState, useCallback } from 'react';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import { usePublicClient, useReadContract } from 'wagmi';

import {
  useVaultInfo,
  VAULT_DEFAULT_REPORT_FRESHNESS_DELTA,
  VAULT_SHOULD_REPORT_THRESHOLD,
} from 'modules/vaults';

import { getVaultHubContract } from '../../modules/vaults/contracts/vault-hub';
import {
  STRATEGY_EAGER,
  STRATEGY_IMMUTABLE,
} from 'consts/react-query-strategies';
import { getContractAddress } from 'config';
import { StakingVaultAbi } from 'abi/vault';
import { VaultHubAbi } from 'abi/vault-hub';

import { encodeFunctionData, type Address } from 'viem';
import { fetchReportMerkle } from './ipfs';

const UI_UPDATE_INTERVAL = 5000; // 5 second

const toBlockchainTime = () => Math.floor(Date.now() / 1000);

// query to fetch constant  onchain with optimistic data
// will always return bigint and throw warning if onchain!=default
const useReportFreshnessDelta = () => {
  const publicClient = usePublicClient();
  return useQuery({
    queryKey: ['reportFreshnessDelta', publicClient?.chain.id],
    placeholderData: VAULT_DEFAULT_REPORT_FRESHNESS_DELTA,
    initialData: VAULT_DEFAULT_REPORT_FRESHNESS_DELTA,
    queryFn: async () => {
      invariant(publicClient, 'publicClient is required');
      const hub = getVaultHubContract(publicClient);
      const delta = await hub.read.REPORT_FRESHNESS_DELTA();
      if (delta != VAULT_DEFAULT_REPORT_FRESHNESS_DELTA) {
        console.warn(
          `[useReportFreshnessDelta] ⚠️⚠️⚠️ Onchain REPORT_FRESHNESS_DELTA(${delta.toString()}) does not match the default value (${VAULT_DEFAULT_REPORT_FRESHNESS_DELTA.toString()}) ⚠️⚠️⚠️ This must be addressed`,
        );
      }
      return delta;
    },
    // this is okay as delta won't have overflow values
    select: (data) => Number(data.toString()),
    ...STRATEGY_IMMUTABLE,
  }).data;
};

// returns status of the report for current vault
export const useReportStatus = () => {
  const [time, setTime] = useState<number | null>(null);

  // SSR safe timer
  useEffect(() => {
    setTime(toBlockchainTime);
    const interval = setInterval(() => {
      setTime(toBlockchainTime);
    }, UI_UPDATE_INTERVAL);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const reportFreshnessDelta = useReportFreshnessDelta();

  const vaultReport = useReadContract({
    address: activeVault?.address as Address,
    abi: StakingVaultAbi,
    functionName: 'latestReport',
    query: { ...STRATEGY_EAGER, enabled: !!activeVault && !!publicClient },
  });

  const vaultHubReport = useReadContract({
    address: getContractAddress(publicClient!.chain.id, 'vaultHub'),
    abi: VaultHubAbi,
    functionName: 'latestReportData',
    query: { ...STRATEGY_EAGER },
  });

  const shouldSkipCheck = !!(time == null || !vaultReport.data);

  // optimistically say the report is fresh if we don't have data just yet
  const isReportFresh =
    shouldSkipCheck ||
    time - Number(vaultReport.data.timestamp) < reportFreshnessDelta;

  const isReportAvailable =
    vaultReport.data && vaultHubReport.data
      ? vaultReport.data.timestamp < vaultHubReport.data[0]
      : false;

  // when new report is available but old is still fresh
  // we can show suggestive reporting UI
  const shouldApplyReport = !!(
    isReportAvailable &&
    time &&
    vaultReport.data &&
    (time - Number(vaultReport.data.timestamp)) / reportFreshnessDelta >=
      VAULT_SHOULD_REPORT_THRESHOLD
  );

  const prepareReportCall = useCallback(async () => {
    invariant(publicClient, 'publicClient is required');
    invariant(activeVault, 'activeVault is required');

    const hub = getVaultHubContract(publicClient);
    const reportCid = (await hub.read.latestReportData())[2];

    const report = await fetchReportMerkle(
      publicClient.chain.id,
      reportCid,
      activeVault.address,
    );

    return {
      loadingActionText: 'Applying oracle report',
      to: hub.address,
      data: encodeFunctionData({
        abi: hub.abi,
        functionName: 'updateVaultData',
        args: [
          activeVault.address,
          report.totalValueWei,
          report.inOutDelta,
          report.fee,
          report.liabilityShares,
          report.proof,
        ],
      }),
    };
  }, [activeVault, publicClient]);

  return {
    ...vaultReport,
    prepareReportCall,
    isLoading: vaultReport.isLoading || shouldSkipCheck,
    isReportFresh,
    isReportAvailable,
    shouldApplyReport,
  };
};
