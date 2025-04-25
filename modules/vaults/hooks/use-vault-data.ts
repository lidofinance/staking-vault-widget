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

  const [owner, inOutDelta, nodeOperator, locked] = await Promise.all([
    vaultContract.read.owner(),
    vaultContract.read.inOutDelta(),
    vaultContract.read.nodeOperator(),
    vaultContract.read.locked(),
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

  const [liabilityStETH, mintableStETH, stETHLimit] = await Promise.all([
    shares.convertToSteth(liabilityShares),
    shares.convertToSteth(
      bigIntMax(totalMintingCapacity - liabilityShares, 0n),
    ),
    shares.convertToSteth(shareLimit),
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
    stETHLimit,
    apr: null,
    healthScore: healthScore.healthRatio,
    totalMintingCapacity,
    inOutDelta,
    locked,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    balance,
    nodeOperatorFeeBP,
    confirmExpiry,
    shareLimit,
    forcedRebalanceThresholdBP,
    liabilityShares,
    ...rest,
  };
};

export const useSingleVaultData = (vaultAddress: Address | undefined) => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['single-vault-data', publicClient?.chain.id, vaultAddress],
    enabled: !!vaultAddress && !!publicClient,
    queryFn: async (): Promise<VaultInfo> => {
      invariant(publicClient, 'PublicClient is not defined');
      invariant(vaultAddress, 'vaultAddress is not defined');

      return getVaultData({ publicClient, shares, vaultAddress });
    },
    ...STRATEGY_LAZY,
  });
};

// TODO: find way to remove readonly
export const useVaultData = (
  vaultsAddressesList: readonly Address[] | undefined,
) => {
  const { shares } = useLidoSDK();
  const publicClient = usePublicClient();

  return useQuery({
    queryKey: ['vault-data', { data: vaultsAddressesList }],
    enabled: !!vaultsAddressesList?.length && !!publicClient,
    ...STRATEGY_LAZY,
    queryFn: async (): Promise<VaultInfo[]> => {
      invariant(publicClient, 'PublicClient is not ready');

      const vaults: VaultInfo[] = [];

      if (vaultsAddressesList?.length && vaultsAddressesList.length === 0) {
        return vaults;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const vaultAddress of vaultsAddressesList!) {
        vaults.push(
          await getVaultData({
            publicClient,
            vaultAddress,
            shares,
          }),
        );
      }

      return vaults;
    },
  });
};
