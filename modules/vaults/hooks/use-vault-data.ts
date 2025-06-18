import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';

import { getVaultHubContract } from 'modules/vaults/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/vaults/contracts/staking-vault';
import { getDashboardContract } from 'modules/vaults/contracts/dashboard';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { bigIntMax } from 'utils/bigint-math';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';

import type { VaultInfo } from 'types';
import type { Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import { VAULTS_ROOT_ROLES_MAP } from '../consts';
import { useMemo } from 'react';

type VaultDataArgs = {
  publicClient: RegisteredPublicClient;
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

  const [
    connection,
    record,
    obligations,
    nodeOperator,
    withdrawalCredentials,
    balance,
  ] = await Promise.all([
    vaultHubContract.read.vaultConnection([vaultAddress]),
    vaultHubContract.read.vaultRecord([vaultAddress]),
    vaultHubContract.read.vaultObligations([vaultAddress]),
    vaultContract.read.nodeOperator(),
    vaultContract.read.withdrawalCredentials(),
    publicClient.getBalance({
      address: vaultContract.address,
    }),
  ]);

  const {
    liabilityShares,
    inOutDelta: { value: inOutDelta },
    locked,
  } = record;

  const { owner, forcedRebalanceThresholdBP, shareLimit, ...rest } = connection;

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
    dashboardContract.read.nodeOperatorDisbursableFee(),
    dashboardContract.read.withdrawableValue(),
    dashboardContract.read.nodeOperatorFeeRate(),
    dashboardContract.read.totalMintingCapacityShares(),
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
    obligations,
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
