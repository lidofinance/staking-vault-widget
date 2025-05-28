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

  const editMainSettings = useCallback(
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

        const newFeeBP = Math.floor(
          (feeValue * VAULT_TOTAL_BASIS_POINTS) / 100,
        );
        const textFeePercent = (newFeeBP * 100) / VAULT_TOTAL_BASIS_POINTS;

        transactions.push({
          to: owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: 'setNodeOperatorFeeBP',
            args: [BigInt(newFeeBP)],
          }),
          loadingActionText: `${confirmingRoleAction} ${textFeePercent}% Node Operator fee`,
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
          loadingActionText: `${confirmingRoleAction} ${expiryValue} hours Confirmation Lifetime`,
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
  );

  return {
    editMainSettings,
    ...rest,
  };
};
