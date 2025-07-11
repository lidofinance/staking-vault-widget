import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

import type { RegisteredPublicClient } from 'modules/web3/types';
import { getVaultApiURL } from 'config';
import { useLidoSDK } from 'modules/web3';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

import { useVault } from '../vault-context';

export type VaultApiMetrics = {
  rebaseReward: bigint;
  grossStakingRewards: bigint;
  nodeOperatorRewards: bigint;
  dailyLidoFees: bigint;
  netStakingRewards: bigint;
  grossStakingAPR: number;
  grossStakingAprBps: number;
  grossStakingAprPercent: number;
  netStakingAPR: number;
  netStakingAprBps: number;
  netStakingAprPercent: number;
  bottomLine: bigint;
  carrySpreadAPR: number;
  carrySpreadAprBps: number;
  carrySpreadAprPercent: number;
  updatedAt: Date;
};

const fetchVaultLatestMetrics = async (
  vaultAddress: string,
  publicClient: RegisteredPublicClient,
): Promise<VaultApiMetrics> => {
  const apiURL = getVaultApiURL(publicClient.chain.id);
  const res = await fetch(`${apiURL}/vaults/${vaultAddress}/latest-metrics`);

  invariant(
    res.ok,
    '[fetchVaultLatestMetrics] Error when fetching vaults latest metrics',
  );

  const data = await res.json();

  return {
    rebaseReward: BigInt(data.rebaseReward),
    grossStakingRewards: BigInt(data.grossStakingRewards),
    nodeOperatorRewards: BigInt(data.nodeOperatorRewards),
    dailyLidoFees: BigInt(data.dailyLidoFees),
    netStakingRewards: BigInt(data.netStakingRewards),
    grossStakingAPR: Number(data.grossStakingAPR),
    grossStakingAprBps: Number(data.grossStakingAprBps),
    grossStakingAprPercent: Number(data.grossStakingAprPercent),
    netStakingAPR: Number(data.netStakingAPR),
    netStakingAprBps: Number(data.netStakingAprBps),
    netStakingAprPercent: Number(data.netStakingAprPercent),
    bottomLine: BigInt(data.bottomLine),
    carrySpreadAPR: Number(data.carrySpreadAPR),
    carrySpreadAprBps: Number(data.carrySpreadAprBps),
    carrySpreadAprPercent: Number(data.carrySpreadAprPercent),
    updatedAt: new Date(data.updatedAt),
  };
};

export const useVaultLatestMetrics = () => {
  const { publicClient } = useLidoSDK();
  const { activeVault, queryKeys } = useVault();

  return useQuery<VaultApiMetrics, Error>({
    queryKey: [...queryKeys.metrics, 'vault-latest-metrics'],
    queryFn: () =>
      fetchVaultLatestMetrics(activeVault?.address as Address, publicClient),
    enabled: !!activeVault,
    staleTime: STRATEGY_LAZY.staleTime,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};
