import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { getVaultHubContract } from 'modules/vaults/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/vaults/contracts/staking-vault';
import { getDashboardContract } from 'modules/vaults/contracts/dashboard';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { getHealthScore } from 'utils/get-health-score';
import { DEFAULT_ADMIN_ROLE, NODE_OPERATOR_MANAGER_ROLE } from 'consts/roles';
import { bigIntMax } from 'utils/bigint-math';

import type { VaultInfo } from 'types';
import type { PublicClient, Address } from 'viem';
import type { LidoSDKShares } from '@lidofinance/lido-ethereum-sdk/shares';

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

  const vaultHubSocket = await vaultHubContract.read.vaultSocket([
    vaultAddress,
  ]);

  const dashboardContract = getDashboardContract(owner, publicClient);

  const [
    valuation,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    nodeOperatorFeeBP,
    totalMintableShares,
    defaultAdmins,
    nodeOperatorManagers,
    confirmExpiry,
  ] = await Promise.all([
    dashboardContract.read.totalValue(),
    dashboardContract.read.nodeOperatorUnclaimedFee(),
    dashboardContract.read.withdrawableEther(),
    dashboardContract.read.nodeOperatorFeeBP(),
    dashboardContract.read.totalMintingCapacity(),
    dashboardContract.read.getRoleMembers([DEFAULT_ADMIN_ROLE]),
    dashboardContract.read.getRoleMembers([NODE_OPERATOR_MANAGER_ROLE]),
    dashboardContract.read.getConfirmExpiry(),
  ]);

  const [mintedEth, mintableEth, ethLimit] = await Promise.all([
    shares.convertToSteth(vaultHubSocket.liabilityShares),
    shares.convertToSteth(
      bigIntMax(totalMintableShares - vaultHubSocket.liabilityShares, 0n),
    ),
    shares.convertToSteth(vaultHubSocket.shareLimit),
  ]);

  const healthScore = getHealthScore(valuation, vaultHubSocket);

  return {
    mintable: mintableEth,
    minted: mintedEth,
    nodeOperator,
    ethLimit,
    valuation,
    inOutDelta,
    locked,
    apr: null,
    healthScore,
    address: vaultAddress,
    totalMintableShares,
    nodeOperatorUnclaimedFee,
    withdrawableEther,
    owner,
    balance,
    nodeOperatorFeeBP,
    defaultAdmins,
    nodeOperatorManagers,
    confirmExpiry,
    ...vaultHubSocket,
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
