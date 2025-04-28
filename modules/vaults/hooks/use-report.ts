/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useQuery } from '@tanstack/react-query';
import {
  useVaultInfo,
  VAULT_DEFAULT_REPORT_FRESHNESS_DELTA,
  VAULT_SHOULD_REPORT_THRESHOLD,
} from 'modules/vaults';
import invariant from 'tiny-invariant';
import { usePublicClient, useReadContract } from 'wagmi';
import { getVaultHubContract } from '../contracts/vault-hub';
import {
  STRATEGY_EAGER,
  STRATEGY_IMMUTABLE,
} from 'consts/react-query-strategies';
import { useEffect, useState } from 'react';
import { Address } from 'viem';
import { StakingVaultAbi } from 'abi/vault';
import { getContractAddress } from 'config';
import { VaultHubAbi } from 'abi/vault-hub';

const toBlockchainTime = () => Math.floor(Date.now() / 1000);

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

export const useReportStatus = () => {
  const [time, setTime] = useState<number | null>(null);

  // SSR safe timer
  useEffect(() => {
    setTime(toBlockchainTime);
    const interval = setInterval(() => {
      setTime(toBlockchainTime);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const reportFreshnessDelta = useReportFreshnessDelta();

  const report = useReadContract({
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

  const shouldSkipCheck = !!(time == null || report.data);

  // optimistically say the report is fresh if we don't have data just yet
  const isReportFresh =
    shouldSkipCheck &&
    Number(report.data?.timestamp) + reportFreshnessDelta < time!;

  const isReportAvailable =
    report.data && vaultHubReport.data
      ? report.data.timestamp < vaultHubReport.data[0]
      : false;

  // when new report is available but old is still fresh
  // we can show suggestive reporting UI
  const shouldApplyReport =
    isReportAvailable &&
    time &&
    report.data &&
    (time - Number(report.data.timestamp)) / reportFreshnessDelta >
      VAULT_SHOULD_REPORT_THRESHOLD;

  return {
    ...report,
    isLoading: report.isLoading || shouldSkipCheck,
    isReportFresh,
    isReportAvailable,
    shouldApplyReport,
  };
};
