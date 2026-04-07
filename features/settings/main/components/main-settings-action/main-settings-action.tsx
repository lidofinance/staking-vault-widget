import { type FC, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';
import { useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';

import { shouldIncrementTxCounterByAddresses } from 'features/settings/main/utils';
import { useMainSettingsData } from 'features/settings/main/contexts';
import { useDepositorRolesPermissions } from 'features/settings/main/hooks';
import type { MainSettingsFormValidatedValues } from 'features/settings/main/types';

import { Container } from './styled';

export const MainSettingsAction: FC = () => {
  const { watch, reset } = useFormContext<MainSettingsFormValidatedValues>();
  const { isValid, isDirty, isSubmitting, isValidating, disabled } =
    useFormState();
  const isClearDisabled = !isDirty;
  const { data: mainSettingsData } = useMainSettingsData();
  const isSubmitDisabled = isSubmitting || disabled || isValidating || !isValid;
  const { hasConfirmingRole, hasAdmin, hasNodeOperatorManager } =
    useVaultConfirmingRoles();
  const { showForPauserRole, showForResumerRole } =
    useDepositorRolesPermissions();

  const showActionButtons =
    hasConfirmingRole ||
    hasAdmin ||
    hasNodeOperatorManager ||
    showForPauserRole ||
    showForResumerRole;

  const formFields = watch();

  const handleClearMainForm = () => {
    reset();
  };

  const counter = useMemo(() => {
    let counter = 0;

    counter += shouldIncrementTxCounterByAddresses(formFields);

    const {
      feeRate,
      confirmExpiry,
      feeRateCustom,
      confirmExpiryCustom,
      feeRecipient,
      isDepositAllowed,
      pdgPolicy,
    } = formFields;

    const confirmExpiryFormValue =
      confirmExpiry === 'custom' ? confirmExpiryCustom : confirmExpiry;

    // TODO: remove after test runs
    // eslint-disable-next-line no-console
    console.log(
      '=========================== START ===========================',
    );

    if (feeRecipient && feeRecipient !== mainSettingsData?.feeRecipient) {
      // eslint-disable-next-line no-console
      console.log('[MAIN SETTINGS] FeeRecipientForm', feeRecipient);
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] FeeRecipientData',
        mainSettingsData?.feeRecipient,
      );
      counter++;
    }

    const nodeOperatorFeeRateFormValue =
      feeRate === 'custom' ? feeRateCustom : feeRate;

    if (
      nodeOperatorFeeRateFormValue &&
      nodeOperatorFeeRateFormValue !==
        mainSettingsData?.nodeOperatorFeeRateCurrent
    ) {
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] NOFeeRateFormValue',
        nodeOperatorFeeRateFormValue,
      );
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] NOFeeRateDataValue',
        mainSettingsData?.nodeOperatorFeeRateCurrent,
      );
      counter++;
    }

    if (
      confirmExpiryFormValue &&
      confirmExpiryFormValue !== mainSettingsData?.confirmExpiryCurrent
    ) {
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] ConfirmExpiryFormValue',
        confirmExpiryFormValue,
      );
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] ConfirmExpiryDataValue',
        mainSettingsData?.confirmExpiryCurrent,
      );
      counter++;
    }

    if (
      typeof isDepositAllowed === 'boolean' &&
      isDepositAllowed !== mainSettingsData?.isDepositAllowed
    ) {
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] IsDepositAllowedFormValue',
        isDepositAllowed,
      );
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] IsDepositAllowedDataValue',
        mainSettingsData?.isDepositAllowed,
      );
      counter++;
    }

    if (pdgPolicy && pdgPolicy !== mainSettingsData?.pdgPolicy) {
      // eslint-disable-next-line no-console
      console.log('[MAIN SETTINGS] PDGPolicyFormValue', pdgPolicy);
      // eslint-disable-next-line no-console
      console.log(
        '[MAIN SETTINGS] PDGPolicyDataValue',
        mainSettingsData?.pdgPolicy,
      );
      counter++;
    }

    // eslint-disable-next-line no-console
    console.log('[MAIN SETTINGS] final counter value', counter);
    // eslint-disable-next-line no-console
    console.log(
      '=========================== *END* ===========================',
    );
    return counter;
  }, [
    formFields,
    mainSettingsData?.confirmExpiryCurrent,
    mainSettingsData?.nodeOperatorFeeRateCurrent,
    mainSettingsData?.isDepositAllowed,
    mainSettingsData?.feeRecipient,
    mainSettingsData?.pdgPolicy,
  ]);

  const hasChanges = counter > 0;

  if (!showActionButtons) {
    return null;
  }

  return (
    <Container>
      <ConnectWalletButton>
        <Button
          type="button"
          variant="outlined"
          disabled={isClearDisabled || !hasChanges}
          onClick={handleClearMainForm}
          fullwidth
          data-testid="mainSettings-clearButton"
        >
          {vaultTexts.actions.settings.clearChanges}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled || !hasChanges}
          fullwidth
          data-testid="mainSettings-submitButton"
        >
          {vaultTexts.actions.settings.submit(counter)}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
