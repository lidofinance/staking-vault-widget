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

        if (formValues.feeRecipient !== vaultSettings.feeRecipient) {
          transactions.push({
            ...activeVault.dashboard.encode.setFeeRecipient([
              formValues.feeRecipient,
            ]),
            loadingActionText: vaultTexts.actions.settings.feeRecipient,
          });
        }

        const { feeRate, nodeOperatorFeeRateCustom } = formValues;
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const feeValue = Number(
          feeRate !== 'custom' ? feeRate : nodeOperatorFeeRateCustom,
        );

        const isFeeValueChanged =
          feeValue !== Number(vaultSettings?.nodeOperatorFeeRateCurrent);

        if (isFeeValueChanged) {
          const newFee = Math.floor(
            (feeValue * VAULT_TOTAL_BASIS_POINTS) / 100,
          );

          transactions.push({
            ...activeVault.dashboard.encode.setFeeRate([BigInt(newFee)]),
            loadingActionText: vaultTexts.actions.settings.confirmNoFee(
              feeRate === 'custom' ? confirmingRoleAction : 'Setting',
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
              confirmExpiry === 'custom' ? confirmingRoleAction : 'Setting',
              Number(expiryValue / 3600n),
            ),
          });
        }

        const { isDepositAllowed } = formValues;
        const isDepositAllowedChanged =
          isDepositAllowed !== vaultSettings.isDepositAllowed;
        if (isDepositAllowedChanged) {
          const txFnName = isDepositAllowed
            ? 'resumeBeaconChainDeposits'
            : 'pauseBeaconChainDeposits';
          transactions.push({
            ...activeVault.dashboard.encode[txFnName](),
            loadingActionText: vaultTexts.actions.settings[txFnName],
          });
        }

        const result = await withSuccess(
          sendTX({
            transactions:
              isFeeValueChanged || isDepositAllowedChanged
                ? async () => [...prepareReportCalls(), ...transactions]
                : transactions,
            mainActionLoadingText: 'Editing vault settings',
            mainActionCompleteText: 'Edited vault settings',
            renderSuccessContent: GoToVault,
            // because of complex state changes, we don't want to allow retry
            allowRetry: false,
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
