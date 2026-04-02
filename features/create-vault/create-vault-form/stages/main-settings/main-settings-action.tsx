import type { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useRouter } from 'next/router';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { ConnectWalletButton } from 'shared/wallet';

import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';
import {
  ActionButton,
  ActionButtonContainer,
} from 'features/create-vault/create-vault-form/styles';

import type { CreateVaultSchema } from 'features/create-vault/types';

export const MainSettingsAction: FC = () => {
  const router = useRouter();
  const { trigger, setValue } = useFormContext<CreateVaultSchema>();
  const { isValidating, isValid } = useFormState<CreateVaultSchema>();

  const isSubmitDisabled = isValidating || !isValid;

  const handleNavigateToRoot = () => {
    void router.push(appPaths.myVaults);
  };

  const handleSetNextStep = async () => {
    // trigger validation and focus user on the first error
    const isValid = await trigger(undefined, { shouldFocus: true });
    if (!isValid) return;

    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickContinueCreatingVault);
    setValue('step', CREATE_VAULT_FORM_STEPS.confirm);
  };

  return (
    <ActionButtonContainer>
      <ConnectWalletButton>
        <ActionButton
          type="button"
          variant="outlined"
          onClick={handleNavigateToRoot}
          fullwidth
          data-testid="createVault-cancelButton"
        >
          Cancel
        </ActionButton>
        <ActionButton
          type="button"
          onClick={handleSetNextStep}
          disabled={isSubmitDisabled}
          fullwidth
          data-testid="createVault-continueButton"
        >
          Continue
        </ActionButton>
      </ConnectWalletButton>
    </ActionButtonContainer>
  );
};
