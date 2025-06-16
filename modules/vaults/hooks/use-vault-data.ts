import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { getVaultHubContract } from 'modules/vaults/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/vaults/contracts/staking-vault';
import { getDashboardContract } from 'modules/vaults/contracts/dashboard';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { bigIntMax } from 'utils/bigint-math';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';

import type { VaultInfo } from 'types';
import type { PublicClient, Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import { VAULTS_ROOT_ROLES_MAP } from '../consts';
import { useMemo } from 'react';

type VaultDataArgs = {
  publicClient: PublicClient;
  vaultAddress: Address;
  shares: LidoSDKShares;
};

const getVaultData = async ({
  publicClient,
  vaultAddress,
  shares,
}: VaultDataArgs): Promise<VaultInfo> => {
  const vaultHubContract = getVaultHubContract(publicClient);
  const vaultContract = getStakingVaultContract(vaultAddress, publicClient);

  const [owner, inOutDelta, nodeOperator, locked, withdrawalCredentials] =
    await Promise.all([
      vaultContract.read.owner(),
      vaultContract.read.inOutDelta(),
      vaultContract.read.nodeOperator(),
      vaultContract.read.locked(),
      vaultContract.read.withdrawalCredentials(),
    ]);

  const balance = await publicClient.getBalance({
    address: vaultContract.address,
  });

  const { shareLimit, forcedRebalanceThresholdBP, liabilityShares, ...rest } =
    await vaultHubContract.read.vaultSocket([vaultAddress]);

  const dashboardContract = getDashboardContract(owner, publicClient);

  const [
    totalValue,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    nodeOperatorFeeBP,
    totalMintingCapacity,
    defaultAdmins,
    nodeOperatorManagers,
    confirmExpiry,
  ] = await Promise.all([
    dashboardContract.read.totalValue(),
    dashboardContract.read.nodeOperatorUnclaimedFee(),
    dashboardContract.read.withdrawableEther(),
    dashboardContract.read.nodeOperatorFeeBP(),
    dashboardContract.read.totalMintingCapacity(),
    dashboardContract.read.getRoleMembers([VAULTS_ROOT_ROLES_MAP.defaultAdmin]),
    dashboardContract.read.getRoleMembers([
      VAULTS_ROOT_ROLES_MAP.nodeOperatorManager,
    ]),
    dashboardContract.read.getConfirmExpiry(),
  ]);

  const mintableShares = bigIntMax(totalMintingCapacity - liabilityShares, 0n);

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    lockedShares,
    totalMintingCapacityStETH,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToShares(locked),
    shares.convertToSteth(totalMintingCapacity),
  ]);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    address: vaultAddress,
    owner,
    nodeOperator,
    defaultAdmins,
    nodeOperatorManagers,
    totalValue,
    liabilityStETH,
    mintableStETH,
    mintableShares,
    stETHLimit,
    apr: null,
    healthScore: healthScore.healthRatio,
    totalMintingCapacity,
    totalMintingCapacityStETH,
    inOutDelta,
    locked,
    lockedShares,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    nodeOperatorFeeBP,
    confirmExpiry,
    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    withdrawalCredentials,
    ...rest,
  };
};

export const useSingleVaultData = (vaultAddress: Address | undefined) => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();

  const queryKey = useMemo(() => {
    return ['single-vault-data', publicClient?.chain.id, vaultAddress] as const;
  }, [publicClient?.chain.id, vaultAddress]);

  return {
    ...useQuery({
      queryKey,
      enabled: !!vaultAddress && !!publicClient,
      queryFn: async (): Promise<VaultInfo> => {
        invariant(
          publicClient,
          '[useSingleVaultData] PublicClient is not defined',
        );
        invariant(
          vaultAddress,
          '[useSingleVaultData] vaultAddress is not defined',
        );

        return getVaultData({ publicClient, shares, vaultAddress });
      },
      ...STRATEGY_LAZY,
    }),
    queryKey,
  };
};
