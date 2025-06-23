import invariant from 'tiny-invariant';
import { useMemo } from 'react';
import { usePublicClient } from 'wagmi';
import { useQuery } from '@tanstack/react-query';
import { calculateHealth } from '@lidofinance/lsv-cli/dist/utils/health/calculate-health';
import type { Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';

import { type RegisteredPublicClient, useLidoSDK } from 'modules/web3';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { bigIntMax } from 'utils/bigint-math';

import { getVaultHubContract } from '../contracts/vault-hub';
import { getStakingVaultContract } from '../contracts/staking-vault';
import { getDashboardContract } from '../contracts/dashboard';
import { VAULTS_ROOT_ROLES_MAP } from '../consts';
import type { VaultBaseInfo, VaultInfo } from '../types';

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

export const useBaseVaultData = (vaultAddress: Address | undefined) => {
  const { publicClient } = useLidoSDK();
  return useQuery<VaultBaseInfo>({
    queryKey: ['base-vault-data', vaultAddress],
    enabled: !!vaultAddress,
    queryFn: async () => {
      invariant(vaultAddress, '[useBaseVaultData] vaultAddress is not defined');

      const hub = getVaultHubContract(publicClient);
      const vault = getStakingVaultContract(vaultAddress, publicClient);

      const [connection, nodeOperator, withdrawalCredentials] =
        await Promise.all([
          hub.read.vaultConnection([vaultAddress]),
          vault.read.nodeOperator(),
          vault.read.withdrawalCredentials(),
        ]);
      // TODO:
      // - check if dashboard is dashboard
      // - fetch report

      const dashboard = getDashboardContract(connection.owner, publicClient);

      return {
        address: vaultAddress,
        vault,
        dashboard,
        nodeOperator,
        withdrawalCredentials,
        ...connection,
      };
    },
  });
};
