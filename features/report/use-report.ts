/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import invariant from 'tiny-invariant';
import { useMutation, useQuery } from '@tanstack/react-query';
import { usePublicClient, useReadContract, useWalletClient } from 'wagmi';

import {
  useVaultInfo,
  VAULT_DEFAULT_REPORT_FRESHNESS_DELTA,
  VAULT_SHOULD_REPORT_THRESHOLD,
} from 'modules/vaults';

import {
  getVaultHubContract,
  getWritableVaultHubContract,
} from '../../modules/vaults/contracts/vault-hub';
import {
  STRATEGY_EAGER,
  STRATEGY_IMMUTABLE,
} from 'consts/react-query-strategies';
import { getContractAddress } from 'config';
import { StakingVaultAbi } from 'abi/vault';
import { VaultHubAbi } from 'abi/vault-hub';

import type { Address, TransactionReceipt } from 'viem';
import { fetchReportMerkle } from './ipfs';
import { ModalState } from './components';

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

  const shouldSkipCheck = !!(time == null || !report.data);

  // optimistically say the report is fresh if we don't have data just yet
  const isReportFresh =
    shouldSkipCheck ||
    time - Number(report.data.timestamp) < reportFreshnessDelta;

  const isReportAvailable =
    report.data && vaultHubReport.data
      ? report.data.timestamp < vaultHubReport.data[0]
      : false;

  // when new report is available but old is still fresh
  // we can show suggestive reporting UI
  const shouldApplyReport = !!(
    isReportAvailable &&
    time &&
    report.data &&
    (time - Number(report.data.timestamp)) / reportFreshnessDelta >=
      VAULT_SHOULD_REPORT_THRESHOLD
  );

  return {
    ...report,
    isLoading: report.isLoading || shouldSkipCheck,
    isReportFresh,
    isReportAvailable,
    shouldApplyReport,
  };
};

type UseSendReportOptions = {
  setModalState: Dispatch<SetStateAction<ModalState>>;
};

export const useSendReport = ({ setModalState }: UseSendReportOptions) => {
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();
  const { vaultAddress, refetch: refetchVaultInfo } = useVaultInfo();
  const { refetch: refetchReport } = useReportStatus();

  return useMutation<TransactionReceipt, Error>({
    mutationKey: ['sendReport', vaultAddress, publicClient?.chain.id],
    mutationFn: async () => {
      setModalState({ step: 'collecting' });

      // no enabled for useMutation so
      // we have to enforce those invariants with UI
      invariant(publicClient, 'publicClient is required');
      invariant(vaultAddress, 'vaultAddress is required');
      invariant(walletClient, 'walletClient is required');

      const hub = getWritableVaultHubContract(publicClient, walletClient);
      const reportCid = (await hub.read.latestReportData())[2];

      const report = await fetchReportMerkle(
        publicClient.chain.id,
        reportCid,
        vaultAddress,
      );

      setModalState({ step: 'initiate' });

      const tx = await hub.write.updateVaultData([
        vaultAddress,
        report.totalValueWei,
        report.inOutDelta,
        report.fee,
        report.liabilityShares,
        report.proof,
      ]);

      setModalState({ step: 'confirming', tx });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
        confirmations: 1,
      });

      setModalState({ step: 'success', tx });

      return receipt;
    },
    onError: (error) => {
      console.error('[useSendReport] Error', error);
      setModalState({ step: 'error' });
    },
    onSuccess: () => {
      // TODO to query client invalidateQueries
      void Promise.all([refetchVaultInfo(), refetchReport()]);
    },
  });
};
