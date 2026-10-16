import type { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useRouter } from 'next/router';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { ConnectWalletButton } from 'shared/wallet';

import {
  CREATE_VAULT_FORM_STEPS,
  STEP_FIELDS,
  type FormStepWithFields,
} from 'features/create-vault/consts';
import {
  ActionButton,
  ActionButtonContainer,
} from 'features/create-vault/create-vault-form/styles';

import type { CreateVaultFormValues } from 'features/create-vault/types';

type StepActionProps = {
  step: FormStepWithFields;
};

export const StepAction: FC<StepActionProps> = ({ step }) => {
  const router = useRouter();
  const fields = STEP_FIELDS[step];
  const { trigger, setValue } = useFormContext<CreateVaultFormValues>();
  const { isValidating, errors, disabled } =
    useFormState<CreateVaultFormValues>({
      name: fields,
    });

  const isFirstStep = step === CREATE_VAULT_FORM_STEPS.addresses;
  // only fields of the current step block moving forward
  const hasStepErrors = fields.some((field) => !!errors[field]);
  const isNextDisabled = disabled || isValidating || hasStepErrors;

  const handleBack = () => {
    if (isFirstStep) {
      void router.push(appPaths.myVaults);
      return;
    }
    setValue('step', step - 1);
  };

  const handleNext = async () => {
    // trigger validation and focus user on the first error
    const isStepValid = await trigger(fields, { shouldFocus: true });
    if (!isStepValid) return;

    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickContinueCreatingVault);
    setValue('step', step + 1);
  };

  return (
    <ActionButtonContainer>
      <ActionButton
        type="button"
        variant="outlined"
        onClick={handleBack}
        fullwidth
        data-testid={
          isFirstStep ? 'createVault-cancelButton' : 'createVault-backButton'
        }
      >
        {isFirstStep ? 'Cancel' : 'Back'}
      </ActionButton>
      <ConnectWalletButton>
        <ActionButton
          type="button"
          onClick={handleNext}
          disabled={isNextDisabled}
          fullwidth
          data-testid="createVault-continueButton"
        >
          Continue
        </ActionButton>
      </ConnectWalletButton>
    </ActionButtonContainer>
  );
};
