import { type Address } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';
import { getVaultHubContract } from 'modules/web3/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/web3/contracts/staking-vault';
import { getDelegationContract } from 'modules/web3/contracts/delegation';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { getHealthScore } from 'utils/get-health-score';
import { VaultSocket, VaultInfo } from 'types';

export const useVaultData = (vaultsAddressesList: Address[] = []) => {
  const { shares } = useLidoSDK();

  return useQuery({
    queryKey: ['vault-data', { data: vaultsAddressesList }],
    enabled: !!vaultsAddressesList?.length,
    ...STRATEGY_LAZY,
    queryFn: async (): Promise<VaultInfo[]> => {
      const vaultHabContract = getVaultHubContract();
      const vaults: VaultInfo[] = [];

      if (vaultsAddressesList?.length < 1) {
        return vaults;
      }

      for (const vaultAddress of vaultsAddressesList) {
        const vaultContract = getStakingVaultContract(vaultAddress);
        const owner = await vaultContract.read.owner();

        const delegationContract = getDelegationContract(owner);
        const vaultHubSocket: VaultSocket =
          await vaultHabContract.read.vaultSocket([vaultAddress]);

        const valuation = await delegationContract.read.valuation();
        const healthScore = getHealthScore(valuation, vaultHubSocket);
        const totalMintableShares =
          await delegationContract.read.totalMintableShares();
        const mintedEth = await shares.convertToSteth(
          vaultHubSocket.sharesMinted,
        );
        const mintableEth = await shares.convertToSteth(
          totalMintableShares - vaultHubSocket.sharesMinted,
        );

        vaults.push({
          mintable: mintableEth,
          minted: mintedEth,
          valuation,
          apr: null,
          healthScore,
          address: vaultAddress,
        });
      }

      return vaults;
    },
  });
};
