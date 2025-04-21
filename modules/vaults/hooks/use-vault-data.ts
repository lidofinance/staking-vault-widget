import { type Address } from 'viem';
import { usePublicClient } from 'wagmi';
import invariant from 'tiny-invariant';
import { useQuery } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { getVaultHubContract } from 'modules/vaults/contracts/vault-hub';
import { getStakingVaultContract } from 'modules/vaults/contracts/staking-vault';
import { getDelegationContract } from 'modules/vaults/contracts/delegation';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import { getHealthScore } from 'utils/get-health-score';

import type { VaultInfo } from 'types';
import { DEFAULT_ADMIN_ROLE, NODE_OPERATOR_MANAGER_ROLE } from 'consts/roles';

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

        const vaultHubSocket = await vaultHubContract.read.vaultSocket([
          vaultAddress,
        ]);

        const delegationContract = getDelegationContract(owner, publicClient);

        const [
          valuation,
          nodeOperatorUnclaimedFee,
          withdrawableEther,
          nodeOperatorFeeBP,
          totalMintableShares,
          confirmExpiry,
          defaultAdmins,
          nodeOperatorManagers,
        ] = await Promise.all([
          delegationContract.read.totalValue(),
          delegationContract.read.nodeOperatorUnclaimedFee(),
          delegationContract.read.withdrawableEther(),
          delegationContract.read.nodeOperatorFeeBP(),
          delegationContract.read.totalMintingCapacity(),
          delegationContract.read.getConfirmExpiry(),
          delegationContract.read.getRoleMembers([DEFAULT_ADMIN_ROLE]),
          delegationContract.read.getRoleMembers([NODE_OPERATOR_MANAGER_ROLE]),
        ]);

        const [mintedEth, mintableEth, ethLimit] = await Promise.all([
          shares.convertToSteth(vaultHubSocket.liabilityShares),
          shares.convertToSteth(
            totalMintableShares - vaultHubSocket.liabilityShares,
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
          confirmExpiry,
          defaultAdmins,
          nodeOperatorManagers,
          ...vaultHubSocket,
        });
      }

      return vaults;
    },
  });
};
