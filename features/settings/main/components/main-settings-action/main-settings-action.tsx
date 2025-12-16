import { FC, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';
import { useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';

import { shouldIncrementTxCounterByAddresses } from 'features/settings/main/utils';
import { useMainSettingsData } from 'features/settings/main/contexts';
import { useDepositorRolesPermissions } from 'features/settings/main/hooks';
import { MainSettingsFormValidatedValues } from 'features/settings/main/types';

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

    if (feeRecipient !== mainSettingsData?.feeRecipient) {
      counter++;
    }

    const nodeOperatorFeeRateFormValue =
      feeRate === 'custom' ? feeRateCustom : feeRate;

    if (
      nodeOperatorFeeRateFormValue !== '' &&
      nodeOperatorFeeRateFormValue !==
        mainSettingsData?.nodeOperatorFeeRateCurrent
    ) {
      counter++;
    }

    if (
      confirmExpiryFormValue !== '' &&
      confirmExpiryFormValue !== mainSettingsData?.confirmExpiryCurrent
    ) {
      counter++;
    }

    if (isDepositAllowed !== mainSettingsData?.isDepositAllowed) {
      counter++;
    }

    if (pdgPolicy !== mainSettingsData?.pdgPolicy) {
      counter++;
    }

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
