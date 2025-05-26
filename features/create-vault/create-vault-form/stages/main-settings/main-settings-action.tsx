import type { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { useRouter } from 'next/router';

import { useDappStatus } from 'modules/web3';
import { appPaths } from 'consts/routing';

import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';
import {
  ActionButton,
  ActionButtonContainer,
} from 'features/create-vault/create-vault-form/styles';

import type { CreateVaultSchema } from 'features/create-vault/types';

export const MainSettingsAction: FC = () => {
  const router = useRouter();
  const { trigger, setValue } = useFormContext<CreateVaultSchema>();
  const { isValidating } = useFormState<CreateVaultSchema>();
  const { isDappActive } = useDappStatus();

  const isSubmitDisabled = !isDappActive || isValidating;

  const handleNavigateToRoot = () => {
    void router.push(appPaths.myVaults);
  };

  const handleSetNextStep = async () => {
    // trigger validation and focus user on the first error
    const isValid = await trigger(undefined, { shouldFocus: true });
    if (!isValid) return;

    setValue('step', CREATE_VAULT_FORM_STEPS.confirm);
  };

  return (
    <ActionButtonContainer>
      <ActionButton
        type="button"
        variant="outlined"
        onClick={handleNavigateToRoot}
        fullwidth
      >
        Cancel
      </ActionButton>
      <ActionButton
        type="button"
        onClick={handleSetNextStep}
        disabled={isSubmitDisabled}
        fullwidth
      >
        Continue
      </ActionButton>
    </ActionButtonContainer>
  );
};
