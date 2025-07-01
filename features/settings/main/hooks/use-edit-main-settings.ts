import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import type { Hash } from 'viem';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_ROOT_ROLES_MAP,
  vaultTexts,
  GoToVault,
  useReportCalls,
  useVaultConfirmingRoles,
} from 'modules/vaults';

import { useMainSettingsData } from '../contexts';

import type { MainSettingsFormValidatedValues } from '../types';

type RoleValueType = MainSettingsFormValidatedValues['defaultAdmins'][number];

const onlyState = (state: 'grant' | 'remove') => (value: RoleValueType) =>
  value.state === state;

const toMethodArg = (role: Hash) => (value: RoleValueType) => ({
  role,
  account: value.value,
});

export const useEditMainSettings = () => {
  const { hasBothConfirmingRoles } = useVaultConfirmingRoles();
  const { activeVault } = useVault();
  const prepareReportCalls = useReportCalls();
  const { data: vaultSettings } = useMainSettingsData();

  const { sendTX, ...rest } = useSendTransaction();

  return {
    editMainSettings: useCallback(
      async (formValues: MainSettingsFormValidatedValues) => {
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
          ...formValues.defaultAdmins
            .filter(onlyState('grant'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['defaultAdmin'])),
          ...formValues.nodeOperatorManagers
            .filter(onlyState('grant'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['nodeOperatorManager'])),
        ];

        if (grantRoles.length > 0) {
          transactions.push({
            ...activeVault.dashboard.encode.grantRoles([grantRoles]),
            loadingActionText: vaultTexts.actions.settings.rolesGrantLoading(
              grantRoles.length,
            ),
          });
        }

        const revokeRoles = [
          ...formValues.defaultAdmins
            .filter(onlyState('remove'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['defaultAdmin'])),
          ...formValues.nodeOperatorManagers
            .filter(onlyState('remove'))
            .map(toMethodArg(VAULTS_ROOT_ROLES_MAP['nodeOperatorManager'])),
        ];

        const confirmingRoleAction = hasBothConfirmingRoles
          ? 'Setting'
          : 'Proposing';

        if (revokeRoles.length > 0) {
          transactions.push({
            ...activeVault.dashboard.encode.revokeRoles([revokeRoles]),
            loadingActionText: vaultTexts.actions.settings.rolesRevokeLoading(
              revokeRoles.length,
            ),
          });
        }

        if (
          formValues.nodeOperatorFeeRecipient !==
          vaultSettings.nodeOperatorFeeRecipient
        ) {
          transactions.push({
            ...activeVault.dashboard.encode.setNodeOperatorFeeRecipient([
              formValues.nodeOperatorFeeRecipient,
            ]),
            loadingActionText:
              vaultTexts.actions.settings.nodeOperatorFeeRecipient,
          });
        }

        const { nodeOperatorFeeRate, nodeOperatorFeeRateCustom } = formValues;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const feeValue = Number(
          nodeOperatorFeeRate !== 'custom'
            ? nodeOperatorFeeRate
            : nodeOperatorFeeRateCustom,
        );

        const isFeeValueChanged =
          feeValue !== Number(vaultSettings?.nodeOperatorFeeRateCurrent);

        if (isFeeValueChanged) {
          const newFee = Math.floor(
            (feeValue * VAULT_TOTAL_BASIS_POINTS) / 100,
          );

          transactions.push({
            ...activeVault.dashboard.encode.setNodeOperatorFeeRate([
              BigInt(newFee),
            ]),
            loadingActionText: vaultTexts.actions.settings.confirmNoFee(
              confirmingRoleAction,
              feeValue,
            ),
          });
        }

        const { confirmExpiry, confirmExpiryCustom } = formValues;
        const expiryValue =
          confirmExpiry === 'custom' && confirmExpiryCustom
            ? BigInt(confirmExpiryCustom) * 3600n
            : BigInt(confirmExpiry);
        const isExpiryValueChanged =
          expiryValue !== BigInt(vaultSettings.confirmExpiryCurrent);

        if (isExpiryValueChanged) {
          transactions.push({
            ...activeVault.dashboard.encode.setConfirmExpiry([expiryValue]),
            loadingActionText: vaultTexts.actions.settings.confirmExpiry(
              confirmingRoleAction,
              Number(expiryValue / 3600n),
            ),
          });
        }

        const result = await withSuccess(
          sendTX({
            transactions: isFeeValueChanged
              ? async () => [...prepareReportCalls(), ...transactions]
              : transactions,
            mainActionLoadingText: 'Editing vault settings',
            mainActionCompleteText: 'Edited vault settings',
            renderSuccessContent: GoToVault,
          }),
        );

        return {
          result,
          isStateChanged: isFeeValueChanged,
        };
      },
      [
        vaultSettings,
        activeVault,
        hasBothConfirmingRoles,
        sendTX,
        prepareReportCalls,
      ],
    ),
    ...rest,
  };
};
