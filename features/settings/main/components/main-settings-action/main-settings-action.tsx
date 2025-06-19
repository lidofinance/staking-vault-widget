import { FC, useMemo } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';
import { useVaultConfirmingRoles, vaultTexts } from 'modules/vaults';

import {
  shouldIncrementTxCounterByVoting,
  shouldIncrementTxCounterByAddresses,
} from 'features/settings/main/utils';
import { useMainSettingsData } from 'features/settings/main/contexts';

import { Container } from './styled';

import { EditMainSettingsSchema } from 'features/settings/main/types';

export const MainSettingsAction: FC = () => {
  const { watch, reset } = useFormContext<EditMainSettingsSchema>();
  const { isValid, isDirty, isSubmitting, isValidating, disabled } =
    useFormState();
  const isClearDisabled = !isDirty;
  const mainSettingsData = useMainSettingsData();
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
      } = formFields;
      const currentnodeOperatorFeeRate =
        nodeOperatorFeeRate === 'custom'
          ? nodeOperatorFeeRateCustom
          : nodeOperatorFeeRate;
      const currentConfirmExpiry =
        confirmExpiry === 'custom' ? confirmExpiryCustom : confirmExpiry;

      if (
        shouldIncrementTxCounterByVoting(
          currentnodeOperatorFeeRate,
          mainSettingsData?.nodeOperatorFeeRate.find(
            (item) => item.type === 'current',
          )?.value,
        )
      ) {
        counter++;
      }

      if (
        shouldIncrementTxCounterByVoting(
          currentConfirmExpiry,
          mainSettingsData?.confirmExpiry.find(
            (item) => item.type === 'current',
          )?.value,
        )
      ) {
        counter++;
      }
    }

    return counter;
  }, [
    formFields,
    isValid,
    mainSettingsData?.confirmExpiry,
    mainSettingsData?.nodeOperatorFeeRate,
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
        >
          {vaultTexts.actions.settings.clearChanges}
        </Button>
        <Button
          type="submit"
          disabled={isSubmitDisabled || !hasChanges}
          fullwidth
        >
          {vaultTexts.actions.settings.submit(counter)}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
