import { isAddressEqual, zeroAddress, type Address } from 'viem';

import { calculateHealth } from 'utils';
import {
  getDashboardContract,
  getLidoV3Contract,
  getVaultHubContract,
} from 'modules/vaults';

import type { RegisteredPublicClient } from 'modules/web3';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vaultAddress: Address;
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
}: VaultDataArgs): Promise<VaultTableInfo> => {
  const vaultHub = getVaultHubContract(publicClient);
  const lidoV3Contract = getLidoV3Contract(publicClient);

  const { owner, forcedRebalanceThresholdBP } =
    await vaultHub.read.vaultConnection([vaultAddress]);

  if (isAddressEqual(zeroAddress, owner)) {
    throw new Error(
      `[getVaultDataTable ] no such vault connected: ${vaultAddress}`,
    );
  }

  const dashboardContract = getDashboardContract(owner, publicClient);

  const [totalValue, liabilityShares] = await Promise.all([
    dashboardContract.read.totalValue(),
    dashboardContract.read.liabilityShares(),
  ]);

  const liabilityStETH = await lidoV3Contract.read.getPooledEthBySharesRoundUp([
    liabilityShares,
  ]);

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
