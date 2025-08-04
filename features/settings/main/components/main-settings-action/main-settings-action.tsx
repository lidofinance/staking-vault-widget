import { FC, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';
import { useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';

import { shouldIncrementTxCounterByAddresses } from 'features/settings/main/utils';
import { useMainSettingsData } from 'features/settings/main/contexts';

import { Container } from './styled';

import { MainSettingsFormValidatedValues } from 'features/settings/main/types';

export const MainSettingsAction: FC = () => {
  const { watch, reset } = useFormContext<MainSettingsFormValidatedValues>();
  const { isValid, isDirty, isSubmitting, isValidating, disabled } =
    useFormState();
  const isClearDisabled = !isDirty;
  const { data: mainSettingsData } = useMainSettingsData();
  const isSubmitDisabled = isSubmitting || disabled || isValidating;
  const { hasConfirmingRole, hasAdmin, hasNodeOperatorManager } =
    useVaultConfirmingRoles();
  const showActionButtons =
    hasConfirmingRole || hasAdmin || hasNodeOperatorManager;

  const formFields = watch();

  const handleClearMainForm = () => {
    reset();
  };

  const counter = useMemo(() => {
    let counter = 0;

    if (isValid) {
      counter += shouldIncrementTxCounterByAddresses(formFields);

      const {
        nodeOperatorFeeRate,
        confirmExpiry,
        nodeOperatorFeeRateCustom,
        confirmExpiryCustom,
        nodeOperatorFeeRecipient,
      } = formFields;

      const confirmExpiryFormValue =
        confirmExpiry === 'custom' ? confirmExpiryCustom : confirmExpiry;

      if (
        nodeOperatorFeeRecipient !== mainSettingsData?.nodeOperatorFeeRecipient
      ) {
        counter++;
      }

      const nodeOperatorFeeRateFormValue =
        nodeOperatorFeeRate === 'custom'
          ? nodeOperatorFeeRateCustom
          : nodeOperatorFeeRate;

      if (
        nodeOperatorFeeRateFormValue !==
        mainSettingsData?.nodeOperatorFeeRateCurrent
      ) {
        counter++;
      }

      if (confirmExpiryFormValue !== mainSettingsData?.confirmExpiryCurrent) {
        counter++;
      }
    }

    return counter;
  }, [
    formFields,
    isValid,
    mainSettingsData?.confirmExpiryCurrent,
    mainSettingsData?.nodeOperatorFeeRateCurrent,
    mainSettingsData?.nodeOperatorFeeRecipient,
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
