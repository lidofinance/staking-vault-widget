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
import invariant from 'tiny-invariant';

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

      const vaultHubContract = getVaultHubContract(publicClient);
      const vaults: VaultInfo[] = [];

      if (vaultsAddressesList?.length && vaultsAddressesList.length === 0) {
        return vaults;
      }

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      for (const vaultAddress of vaultsAddressesList!) {
        const vaultContract = getStakingVaultContract(
          vaultAddress,
          publicClient,
        );

        const [owner, inOutDelta, nodeOperator, locked] = await Promise.all([
          vaultContract.read.owner(),
          vaultContract.read.inOutDelta(),
          vaultContract.read.nodeOperator(),
          vaultContract.read.locked(),
        ]);

        const balance = await publicClient.getBalance({
          address: vaultContract.address,
        });

        const vaultHubSocket: VaultSocket =
          await vaultHubContract.read.vaultSocket([vaultAddress]);
        const delegationContract = getDelegationContract(owner, publicClient);

        const [
          valuation,
          nodeOperatorUnclaimedFee,
          withdrawableEther,
          nodeOperatorFeeBP,
          totalMintableShares,
        ] = await Promise.all([
          delegationContract.read.valuation(),
          delegationContract.read.nodeOperatorUnclaimedFee(),
          delegationContract.read.withdrawableEther(),
          delegationContract.read.nodeOperatorFeeBP(),
          delegationContract.read.totalMintableShares(),
        ]);

        const [mintedEth, mintableEth, ethLimit] = await Promise.all([
          shares.convertToSteth(vaultHubSocket.sharesMinted),
          shares.convertToSteth(
            totalMintableShares - vaultHubSocket.sharesMinted,
          ),
          shares.convertToSteth(vaultHubSocket.shareLimit),
        ]);

        const healthScore = getHealthScore(valuation, vaultHubSocket);

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
