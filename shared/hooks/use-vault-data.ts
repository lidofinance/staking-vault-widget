import { type Address } from 'viem';
import { useQuery } from '@tanstack/react-query';
import { useLidoSDK } from 'modules/web3';

import { getVaultHubContract } from 'modules/web3/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/web3/contracts/staking-vault';
import { getDelegationContract } from 'modules/web3/contracts/delegation';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { getHealthScore } from 'utils/get-health-score';
import { VaultSocket, VaultInfo } from 'types';
import { usePublicClient } from 'wagmi';

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
      const vaults: VaultInfo[] = [];

      if (!publicClient) {
        return vaults;
      }

      const vaultHabContract = getVaultHubContract(publicClient);

      if (vaultsAddressesList?.length && vaultsAddressesList.length === 0) {
        return vaults;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const vaultAddress of vaultsAddressesList!) {
        const vaultContract = getStakingVaultContract(
          vaultAddress,
          publicClient,
        );
        const owner = await vaultContract.read.owner();
        const inOutDelta = await vaultContract.read.inOutDelta();
        const nodeOperator = await vaultContract.read.nodeOperator();
        const balance = await publicClient.getBalance({
          address: vaultContract.address,
        });
        const locked = await vaultContract.read.locked();
        const delegationContract = getDelegationContract(owner, publicClient);

        const vaultHubSocket: VaultSocket =
          await vaultHabContract.read.vaultSocket([vaultAddress]);
        const valuation = await delegationContract.read.valuation();
        const nodeOperatorUnclaimedFee =
          await delegationContract.read.nodeOperatorUnclaimedFee();
        const withdrawableEther =
          await delegationContract.read.withdrawableEther();

        const nodeOperatorFeeBP =
          await delegationContract.read.nodeOperatorFeeBP();
        const healthScore = getHealthScore(valuation, vaultHubSocket);
        const totalMintableShares =
          await delegationContract.read.totalMintableShares();
        const mintedEth = await shares.convertToSteth(
          vaultHubSocket.sharesMinted,
        );
        const mintableEth = await shares.convertToSteth(
          totalMintableShares - vaultHubSocket.sharesMinted,
        );
        const ethLimit = await shares.convertToSteth(vaultHubSocket.shareLimit);

        vaults.push({
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
          ...vaultHubSocket,
        });
      }

      return vaults;
    },
  });
};
