import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';
import type { VaultInfo } from 'types';
import type { Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import { getVaultHubContract } from 'modules/vaults/contracts/vault-hub';
import {
  getOperatorGridContract,
  getStakingVaultContract,
  getDashboardContract,
} from 'modules/vaults/contracts';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { bigIntMax } from 'utils/bigint-math';

import { VAULTS_ROOT_ROLES_MAP } from '../consts';

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
  const operatorGridContract = getOperatorGridContract(publicClient);
  const vaultContract = getStakingVaultContract(vaultAddress, publicClient);

  const [
    connection,
    isVaultConnected,
    record,
    obligations,
    tier,
    nodeOperator,
    withdrawalCredentials,
    balance,
  ] = await Promise.all([
    vaultHubContract.read.vaultConnection([vaultAddress]),
    vaultHubContract.read.isVaultConnected([vaultAddress]),
    vaultHubContract.read.vaultRecord([vaultAddress]),
    vaultHubContract.read.vaultObligations([vaultAddress]),
    operatorGridContract.read.vaultInfo([vaultAddress]),
    vaultContract.read.nodeOperator(),
    vaultContract.read.withdrawalCredentials(),
    publicClient.getBalance({
      address: vaultContract.address,
    }),
  ]);

  const tierId = tier[1];
  const tierShareLimit = tier[2];

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
    nodeOperatorFeeRate,
    totalMintingCapacity,
    defaultAdmins,
    nodeOperatorManagers,
    nodeOperatorFeeRecipient,
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
    dashboardContract.read.nodeOperatorFeeRecipient(),
    dashboardContract.read.getConfirmExpiry(),
  ]);

  const mintableShares = bigIntMax(totalMintingCapacity - liabilityShares, 0n);

  const [
    liabilityStETH,
    mintableStETH,
    stETHLimit,
    lockedShares,
    totalMintingCapacityStETH,
    tierStETHLimit,
  ] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(mintableShares),
    shares.convertToSteth(shareLimit),
    shares.convertToShares(locked),
    shares.convertToSteth(totalMintingCapacity),
    shares.convertToSteth(tierShareLimit),
  ]);

  const healthScore = calculateHealth({
    totalValue,
    liabilitySharesInStethWei: liabilityStETH,
    forceRebalanceThresholdBP: forcedRebalanceThresholdBP,
  });

  return {
    address: vaultAddress,
    isVaultConnected,
    owner,
    nodeOperator,
    defaultAdmins,
    nodeOperatorManagers,
    nodeOperatorFeeRecipient,
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
    nodeOperatorFeeRate,
    confirmExpiry,
    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    withdrawalCredentials,
    obligations,
    tierStETHLimit,
    tierId: tierId.toString(),
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
