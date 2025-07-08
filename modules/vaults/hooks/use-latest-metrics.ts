import { useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { Address } from 'viem';

import { VaultApiMetrics } from 'types/vault-api';
import { useVaultOverviewData } from './use-vault-overview-data';

const BASE_URL = process.env.NEXT_PUBLIC_VAULTS_API_BASE_URL;

const fetchVaultLatestMetrics = async (
  vaultAddress: string,
): Promise<VaultApiMetrics> => {
  invariant(BASE_URL, '[fetchVaultLatestMetrics] BASE_URL is not defined');

  const res = await fetch(`${BASE_URL}/vaults/${vaultAddress}/latest-metrics`);

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
  const { data: vaultData } = useVaultOverviewData();
  const { data, isLoading, ...rest } = useQuery<VaultApiMetrics, Error>({
    queryKey: ['useVaultLatestMetrics', vaultData?.address],
    queryFn: () => fetchVaultLatestMetrics(vaultData?.address as Address),
    enabled: !!vaultData?.address,
    staleTime: 1000 * 60 * 60,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  return {
    data: data ?? ({} as VaultApiMetrics),
    isLoadingMetrics: isLoading,
    ...rest,
  };
};
