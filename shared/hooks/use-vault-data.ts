import { type Address } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { getVaultHubContract } from 'modules/web3/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/web3/contracts/staking-vault';
import { getDelegationContract } from 'modules/web3/contracts/delegation';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { VaultSocket, VaultInfo } from 'types';

export const useVaultData = (vaultsAddressesList: Address[] | undefined) => {
  const vaultHabContract = getVaultHubContract();

  const {
    data: vaultsData,
    error,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['vault-data', { data: vaultsAddressesList }],
    enabled: !!vaultsAddressesList?.length,
    ...STRATEGY_LAZY,
    queryFn: async () => {
      const vaultsCount = vaultsAddressesList?.length ?? 0;
      const vaults: VaultInfo[] = [];

      if (vaultsAddressesList?.length) {
        for (const vaultAddress of vaultsAddressesList) {
          const vaultContract = getStakingVaultContract(vaultAddress);
          const owner = await vaultContract.read.owner();
          const locked = await vaultContract.read.locked();

          const delegationContract = getDelegationContract(owner);
          const vaultHubSocket: VaultSocket =
            await vaultHabContract.read.vaultSocket([vaultAddress]);

          const curatorUnclaimedFee =
            await delegationContract.read.curatorUnclaimedFee();
          const nodeOperatorUnclaimedFee =
            await delegationContract.read.nodeOperatorUnclaimedFee();
          const valuation = await delegationContract.read.valuation();
          const minted = vaultHubSocket.sharesMinted;
          const reserved =
            locked + curatorUnclaimedFee + nodeOperatorUnclaimedFee;
          const healthScore = Number(valuation / (reserved + minted));
          const totalMintable =
            valuation * BigInt(1 - vaultHubSocket.reserveRatioBP);
          const mintable = totalMintable - minted;

          vaults.push({
            mintable,
            minted,
            valuation,
            apr: null,
            healthScore,
            address: vaultAddress,
          });
        }
      }

      return { vaults, vaultsCount };
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
