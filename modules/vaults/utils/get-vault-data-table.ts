import { isAddressEqual, zeroAddress, type Address } from 'viem';

import { calculateHealth } from 'utils';
import { getStEthContract } from 'modules/vaults';

import {
  LidoSDKVaultEntity,
  LidoSDKVaultModule,
} from '@lidofinance/lido-ethereum-sdk';

import type { RegisteredPublicClient } from 'modules/web3';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
  vaultModule: LidoSDKVaultModule;
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
  vaultModule,
  vaultAddress,
}: VaultDataArgs): Promise<VaultTableInfo> => {
  const vaultHub = await vaultModule.contracts.getContractVaultHub();
  const vaultEntity = new LidoSDKVaultEntity({
    vaultAddress,
    skipDashboardCheck: true,
    bus: vaultModule,
  });
  const stethContract = getStEthContract(publicClient);

  const { owner, forcedRebalanceThresholdBP } =
    await vaultHub.read.vaultConnection([vaultAddress]);

  if (isAddressEqual(zeroAddress, owner)) {
    throw new Error(
      `[getVaultDataTable ] no such vault connected: ${vaultAddress}`,
    );
  }

  const dashboardContract = await vaultEntity.getDashboardContract();

  const [totalValue, liabilityShares] = await Promise.all([
    dashboardContract.read.totalValue(),
    dashboardContract.read.liabilityShares(),
  ]);

  const liabilityStETH = await stethContract.read.getPooledEthBySharesRoundUp([
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
