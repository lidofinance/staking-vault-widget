import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';

import { getStakingVaultContract, getDashboardContract } from 'modules/vaults';

import type { Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import type { RegisteredPublicClient } from 'modules/web3';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vaultAddress: Address;
  shares: LidoSDKShares;
};

export type VaultTableInfo = {
  address: Address;
  owner: Address;
  totalValue: bigint;
  liabilityStETH: bigint;
  healthScore: number;
  forcedRebalanceThresholdBP: number;
  liabilityShares: bigint;
};

export const getVaultDataTable = async ({
  publicClient,
  vaultAddress,
  shares,
}: VaultDataArgs): Promise<VaultTableInfo> => {
  const vaultContract = getStakingVaultContract(vaultAddress, publicClient);
  const owner = await vaultContract.read.owner();
  const dashboardContract = getDashboardContract(owner, publicClient);

  const [totalValue, liabilityShares, forcedRebalanceThresholdBP] =
    await Promise.all([
      dashboardContract.read.totalValue(),
      dashboardContract.read.liabilityShares(),
      dashboardContract.read.forcedRebalanceThresholdBP(),
    ]);

  const liabilityStETH = await shares.convertToSteth(liabilityShares);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    address: vaultAddress,
    owner,
    totalValue,
    liabilityStETH,
    healthScore:
      healthScore.healthRatio > 100000 ? Infinity : healthScore.healthRatio,
    forcedRebalanceThresholdBP,
    liabilityShares,
  };
};
