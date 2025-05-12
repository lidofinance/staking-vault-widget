import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import {
  useVaultInfo,
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ROOT_ROLES_MAP,
} from 'modules/vaults';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { EditMainSettingsSchema } from 'features/settings/main/types';
import { encodeFunctionData, Hash } from 'viem';
import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultConfirmingRoles } from 'modules/vaults/hooks/use-vault-permissions';
import { GoToVault } from 'modules/vaults/components/go-to-vault';

const onlyState =
  (state: 'grant' | 'remove') =>
  (value: EditMainSettingsSchema['defaultAdmins'][number]) =>
    value.state === state;

const toMethodArg =
  (role: Hash) => (value: EditMainSettingsSchema['defaultAdmins'][number]) => ({
    role,
    account: value.value,
  });

export const useEditMainSettings = () => {
  const { hasBothConfirmingRoles } = useVaultConfirmingRoles();
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  const { sendTX, ...rest } = useSendTransaction();

  return {
    editMainSettings: useCallback(
      async (payload: EditMainSettingsSchema) => {
        invariant(owner, '[useEditMainSettings] owner is undefined');

        const transactions: TransactionEntry[] = [];

        const grantRoles = [
          ...payload.defaultAdmins
            .filter(onlyState('grant'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['defaultAdmin'])),
          ...payload.nodeOperatorManagers
            .filter(onlyState('grant'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['nodeOperatorManager'])),
        ];

        if (grantRoles.length > 0) {
          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'grantRoles',
              args: [grantRoles],
            }),
            loadingActionText: `Granting ${grantRoles.length} roles`,
          });
        }

        const revokeRoles = [
          ...payload.defaultAdmins
            .filter(onlyState('remove'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['defaultAdmin'])),
          ...payload.nodeOperatorManagers
            .filter(onlyState('remove'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['nodeOperatorManager'])),
        ];

        const confirmingRoleAction = hasBothConfirmingRoles
          ? 'Setting'
          : 'Proposing';

        if (revokeRoles.length > 0) {
          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'revokeRoles',
              args: [revokeRoles],
            }),
            loadingActionText: `Revoking ${revokeRoles.length} roles`,
          });
        }

        if (payload.nodeOperatorFeeBP.length > 0) {
          invariant(
            payload.nodeOperatorFeeBP.length == 1,
            '[useEditMainSettings] Invalid nodeOperatorFeeBP length',
          );
          const newFee = Math.floor(
            payload.nodeOperatorFeeBP[0].value * VAULT_TOTAL_BASIS_POINTS,
          );

          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setNodeOperatorFeeBP',
              args: [BigInt(newFee)],
            }),
            loadingActionText: `${confirmingRoleAction} ${newFee / VAULT_TOTAL_BASIS_POINTS}% Node Operator fee  `,
          });
        }

        if (payload.confirmExpiry.length > 0) {
          invariant(
            payload.confirmExpiry.length == 1,
            '[useEditMainSettings] Invalid confirmExpiry length',
          );
          const newConfirmExpiry = BigInt(
            Math.floor(payload.confirmExpiry[0].value * 86400),
          );

          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setConfirmExpiry',
              args: [newConfirmExpiry],
            }),
            loadingActionText: `${confirmingRoleAction} ${newConfirmExpiry} hours Confirmation Lifetime`,
          });
        }

        return withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: 'Editing vault settings',
            mainActionCompleteText: 'Edited vault settings',
            renderSuccessContent: GoToVault,
          }),
        );
      },
      [hasBothConfirmingRoles, owner, sendTX],
    ),
    ...rest,
  };
};
