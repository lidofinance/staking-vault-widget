import { FC } from 'react';
import { useRouter } from 'next/router';

import { useFormContext, useFormState } from 'react-hook-form';
import { CreateVaultSchema } from 'features/create-vault/types';
import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';
import { appPaths } from 'consts/routing';

import {
  ActionButton,
  ActionButtonContainer,
} from 'features/create-vault/create-vault-form/styles';

export const MainSettingsAction: FC = () => {
  const router = useRouter();
  const { trigger, setValue } = useFormContext<CreateVaultSchema>();
  const { isValidating } = useFormState<CreateVaultSchema>();

  const handleNavigateToRoot = () => {
    void router.push(appPaths.myVaults);
  };

  const handleSetNextStep = async () => {
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
        disabled={isValidating}
        fullwidth
      >
        Continue
      </ActionButton>
    </ActionButtonContainer>
  );
};
