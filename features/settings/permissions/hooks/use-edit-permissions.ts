import { useCallback } from 'react';
import { Address, encodeFunctionData, PublicClient } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo, vaultTexts } from 'modules/vaults';
import { GrantRole } from 'features/settings/permissions/types';
import invariant from 'tiny-invariant';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

type EditPermissionsArgs = {
  toRevoke: GrantRole[];
  toGrant: GrantRole[];
};

export const useEditPermissions = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const owner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();

  return {
    editPermissions: useCallback(
      async ({ toGrant, toRevoke }: EditPermissionsArgs) => {
        invariant(owner, '[useEditPermissions] owner is not defined');
        const transactions: TransactionEntry[] = [];
        if (toGrant.length > 0) {
          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'grantRoles',
              args: [toGrant],
            }),
            loadingActionText: vaultTexts.actions.settings.rolesGrantLoading(
              toGrant.length,
            ),
          });
        }
        if (toRevoke.length > 0) {
          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'revokeRoles',
              args: [toRevoke],
            }),
            loadingActionText: vaultTexts.actions.settings.rolesRevokeLoading(
              toRevoke.length,
            ),
          });
        }
        const result = withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: 'Editing vault permissions',
            mainActionCompleteText: 'Vault permissions edited',
            renderSuccessContent: GoToVault,
          }),
        );

        await refetchVaultInfo();

        return result;
      },
      [owner, refetchVaultInfo, sendTX],
    ),
    ...rest,
  };
};

type SimulateEditPermissions = {
  publicClient: PublicClient;
  delegationAddress: Address;
  account: Address;
  payload: { toRevoke: GrantRole[]; toGrant: GrantRole[] };
};

export const simulateEditPermissionsWithDashboard = async ({
  publicClient,
  delegationAddress,
  account,
  payload,
}: SimulateEditPermissions) => {
  const { toRevoke, toGrant } = payload;
  const simulationList = [];

  if (toRevoke.length > 0) {
    simulationList.push(
      publicClient.simulateContract({
        address: delegationAddress,
        abi: dashboardAbi,
        functionName: 'revokeRoles',
        args: [toRevoke],
        account,
      }),
    );
  }

  if (toGrant.length > 0) {
    simulationList.push(
      publicClient.simulateContract({
        address: delegationAddress,
        abi: dashboardAbi,
        functionName: 'grantRoles',
        args: [toGrant],
        account,
      }),
    );
  }

  return await Promise.all(simulationList);
};
