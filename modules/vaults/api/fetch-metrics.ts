import { getApiURL } from 'config';
import { vaultApiRoutes } from '../consts';

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

type FetchVaultMetricsParams = {
  vaultAddress: string;
};

export const fetchVaultMetrics = async ({
  vaultAddress,
}: FetchVaultMetricsParams): Promise<VaultApiMetrics> => {
  const apiURL = getApiURL('vaultsApiBasePath');
  if (!apiURL) {
    throw new Error('[fetchVaultMetrics] API URL not found');
  }

  const res = await fetch(vaultApiRoutes.vaultMetrics(apiURL, vaultAddress));

  if (!res.ok) {
    throw new Error(`Error fetching vault metrics: ${res.statusText}`);
  }

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
