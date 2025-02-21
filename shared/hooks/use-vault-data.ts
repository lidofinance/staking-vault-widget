import { useMemo } from 'react';
import { getContract, type Address, createPublicClient, http } from 'viem';
import { holesky } from 'viem/chains';
import invariant from 'tiny-invariant';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';
import { useQuery } from '@tanstack/react-query';

import { VaultHubAbi } from 'abi/vault-hub';
import { DelegationAbi } from 'abi/delegation';
import { StakingVaultAbi } from 'abi/vault';
import { VAULT_HUB_BY_NETWORK } from 'consts/vault-hub';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { HubVault, VaultInfo } from 'types';

export const useVaultData = () => {
  // TODO: REFACTOR CODE. TESTING DATA IMPL
  const publicClientMainnet = useMemo(
    () =>
      createPublicClient({
        chain: holesky,
        transport: http('https://1rpc.io/holesky'),
      }),
    [],
  );

  const {
    data: vaultsData,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['vault-data', publicClientMainnet],
    enabled: !!publicClientMainnet,
    ...STRATEGY_LAZY,
    queryFn: async () => {
      invariant(
        publicClientMainnet,
        '[useEthUsd] The "publicClientMainnet" must be define',
      );

      const vaultHabContract = getContract({
        address: VAULT_HUB_BY_NETWORK[CHAINS.Holesky] as Address,
        abi: VaultHubAbi,
        client: {
          public: publicClientMainnet,
        },
      });

      const vaultsCount = await vaultHabContract.read.vaultsCount();
      const vaultsCountNumber = Number(vaultsCount);
      const iterator = Array.from(
        Array.from({ length: vaultsCountNumber }).keys(),
      );
      const hubVaults: HubVault[] = [];
      const vaults: VaultInfo[] = [];
      for (const item of iterator) {
        const vault = await vaultHabContract.read.vaultSocket([BigInt(item)]);

        hubVaults.push(vault);
      }

      for (const hubVault of hubVaults) {
        const vaultContract = getContract({
          address: hubVault.vault,
          abi: StakingVaultAbi,
          client: {
            public: publicClientMainnet,
          },
        });

        const owner = await vaultContract.read.owner();
        const locked = await vaultContract.read.locked();

        const delegationContract = getContract({
          address: owner,
          abi: DelegationAbi,
          client: {
            public: publicClientMainnet,
          },
        });

        const curatorUnclaimedFee =
          await delegationContract.read.curatorUnclaimedFee();
        const nodeOperatorUnclaimedFee =
          await delegationContract.read.nodeOperatorUnclaimedFee();
        const valuation = await delegationContract.read.valuation();
        const minted = hubVault.sharesMinted;
        const reserved =
          locked + curatorUnclaimedFee + nodeOperatorUnclaimedFee;
        const healthScore = Number(valuation / (reserved + minted));
        const totalMintable = valuation * BigInt(1 - hubVault.reserveRatioBP);
        const mintable = totalMintable - minted;

        vaults.push({
          mintable,
          minted,
          valuation,
          apr: null,
          healthScore,
          address: hubVault.vault,
        });
      }

      return { vaults, vaultsCountNumber };
    },
  });

  return {
    vaultsData,
    isLoading,
    error,
    isFetching,
    update: refetch,
  };
};
