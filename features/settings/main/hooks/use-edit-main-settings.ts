import { useCallback } from 'react';
import invariant from 'tiny-invariant';
import {
  useVaultInfo,
  useVaultPermission,
  VAULT_TOTAL_BASIS_POINTS,
  VAULT_TOTAL_BASIS_POINTS_BN,
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
import { useVaultSettings } from './use-vault-settings';
import { useReportCalls } from 'modules/vaults/report';

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
  const prepareReportCalls = useReportCalls();
  const { refetch: refetchConfirmationsInfo, data: vaultSettings } =
    useVaultSettings();
  const { refetch: refetchNOMPermission } = useVaultPermission(
    'nodeOperatorManager',
  );
  const { refetch: refetchAdminPermission } =
    useVaultPermission('defaultAdmin');

  const { sendTX, ...rest } = useSendTransaction();

  return {
    editMainSettings: useCallback(
      async (payload: EditMainSettingsSchema) => {
        invariant(
          vaultSettings,
          '[useEditMainSettings] vaultSettings is undefined',
        );
        invariant(
          activeVault,
          '[useEditMainSettings] activeVault is undefined',
        );

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
            to: activeVault.dashboard.address,
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
            to: activeVault.dashboard.address,
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

        if (
          payload.nodeOperatorFeeRecipient !==
          vaultSettings.nodeOperatorFeeRecipient
        ) {
          transactions.push({
            to: activeVault.dashboard.address,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setNodeOperatorFeeRecipient',
              args: [payload.nodeOperatorFeeRecipient],
            }),
            loadingActionText:
              vaultTexts.actions.settings.nodeOperatorFeeRecipient,
          });
        }

        const { nodeOperatorFeeRate, nodeOperatorFeeRateCustom } = payload;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const feeValue = Number(
          nodeOperatorFeeRate !== 'custom'
            ? nodeOperatorFeeRate
            : nodeOperatorFeeRateCustom,
        );
        const currentFee = Number(
          (vaultSettings.nodeOperatorFeeRate * 100n) /
            VAULT_TOTAL_BASIS_POINTS_BN,
        );
        const isFeeValueChanged = feeValue !== currentFee;

        if (isFeeValueChanged) {
          const newFee = Math.floor(
            (feeValue * VAULT_TOTAL_BASIS_POINTS) / 100,
          );

          transactions.push({
            to: activeVault.dashboard.address,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setNodeOperatorFeeRate',
              args: [BigInt(newFee)],
            }),
            loadingActionText: vaultTexts.actions.settings.confirmNoFee(
              confirmingRoleAction,
              feeValue,
            ),
          });
        }

        const { confirmExpiry, confirmExpiryCustom } = payload;
        const expiryValue =
          confirmExpiry === 'custom' && confirmExpiryCustom
            ? BigInt(confirmExpiryCustom) * 3600n
            : BigInt(confirmExpiry);
        const currentExpiry = vaultSettings.confirmExpiry;
        const isExpiryValueChanged = expiryValue !== currentExpiry;

        if (isExpiryValueChanged) {
          transactions.push({
            to: activeVault.dashboard.address,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: 'setConfirmExpiry',
              args: [expiryValue],
            }),
            loadingActionText: vaultTexts.actions.settings.confirmExpiry(
              confirmingRoleAction,
              Number(expiryValue / 3600n),
            ),
          });
        }

        const result = await withSuccess(
          sendTX({
            transactions: isFeeValueChanged
              ? [...prepareReportCalls(), ...transactions]
              : transactions,
            mainActionLoadingText: 'Editing vault settings',
            mainActionCompleteText: 'Edited vault settings',
            renderSuccessContent: GoToVault,
          }),
        );
        // refetch anyway because some transactions may be successful
        const [vaultInfo, confirmations] = await Promise.all([
          refetchConfirmationsInfo({
            cancelRefetch: true,
            throwOnError: false,
          }),
          refetchNOMPermission({
            cancelRefetch: true,
            throwOnError: false,
          }),
          refetchAdminPermission({
            cancelRefetch: true,
            throwOnError: false,
          }),
        ]);

        return {
          result,
          confirmations,
          vaultInfo,
        };
      },
      [
        vaultSettings,
        activeVault,
        hasBothConfirmingRoles,
        sendTX,
        prepareReportCalls,
        refetchConfirmationsInfo,
        refetchNOMPermission,
        refetchAdminPermission,
      ],
    ),
    ...rest,
  };
};
