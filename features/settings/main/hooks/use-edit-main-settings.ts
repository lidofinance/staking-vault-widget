import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import {
  useVaultInfo,
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ROOT_ROLES_MAP,
  vaultTexts,
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
import { useConfirmationsInfo } from './use-confirmations-info';

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
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const { refetch: refetchConfirmationsInfo } = useConfirmationsInfo();
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
            loadingActionText: vaultTexts.actions.settings.rolesGrantLoading(
              grantRoles.length,
            ),
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
            loadingActionText: vaultTexts.actions.settings.rolesRevokeLoading(
              revokeRoles.length,
            ),
          });
        }

        const {
          nodeOperatorFeeBP,
          nodeOperatorFeeBPCustom,
          nodeOperatorFeeBPDefault,
        } = payload;
        const isOtherFee = nodeOperatorFeeBP === 'other';
        const feeValue = isOtherFee
          ? nodeOperatorFeeBPCustom
          : Number(nodeOperatorFeeBP);
        const feeChanged = isOtherFee
          ? Boolean(feeValue)
          : feeValue !== nodeOperatorFeeBPDefault;

        if (feeChanged && feeValue) {
          invariant(
            !isOtherFee || nodeOperatorFeeBPCustom,
            '[useEditMainSettings] Invalid nodeOperatorFeeBPCustom',
          );

          const newFee = Math.floor(
            (feeValue * VAULT_TOTAL_BASIS_POINTS) / 100,
          );

          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setNodeOperatorFeeBP',
              args: [BigInt(newFee)],
            }),
            loadingActionText: vaultTexts.actions.settings.confirmNoFee(
              confirmingRoleAction,
              feeValue,
            ),
          });
        }

        const { confirmExpiry, confirmExpiryCustom, confirmExpiryDefault } =
          payload;
        const isOtherExpiry = confirmExpiry === 'other';
        const expiryValue = isOtherExpiry ? confirmExpiryCustom : confirmExpiry;
        const expiryChanged = isOtherExpiry
          ? Boolean(expiryValue)
          : expiryValue !== confirmExpiryDefault;

        if (expiryChanged) {
          invariant(
            !isOtherExpiry || confirmExpiryCustom,
            '[useEditMainSettings] Invalid confirmExpiryCustom',
          );

          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConfirmExpiry = BigInt(Math.floor(expiryValue! * 3600));

          transactions.push({
            to: owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setConfirmExpiry',
              args: [newConfirmExpiry],
            }),
            loadingActionText: vaultTexts.actions.settings.confirmExpiry(
              confirmingRoleAction,
              Number(expiryValue),
            ),
          });
        }

        const result = withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: 'Editing vault settings',
            mainActionCompleteText: 'Edited vault settings',
            renderSuccessContent: GoToVault,
          }),
        );

        // refetch anyway because some transactions may be successful
        await refetchVaultInfo();
        await refetchConfirmationsInfo();
        return result;
      },
      [
        hasBothConfirmingRoles,
        owner,
        refetchVaultInfo,
        refetchConfirmationsInfo,
        sendTX,
      ],
    ),
    ...rest,
  };
};
