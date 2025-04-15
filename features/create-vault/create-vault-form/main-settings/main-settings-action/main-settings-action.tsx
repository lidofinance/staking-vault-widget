import { FC } from 'react';
import { useRouter } from 'next/router';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { AppPaths } from 'consts/urls';
import { useFormContext, UseFormReturn } from 'react-hook-form';
import { validateFormValue } from 'utils/validate-form-value';
import { VaultMainSettingsType } from 'features/create-vault/types';
import {
  CREATE_VAULT_FORM_STEPS,
  mainSettingsFields,
} from 'features/create-vault/consts';

export interface MainSettingsActionProps {
  form: UseFormReturn<VaultMainSettingsType>;
}

export const MainSettingsAction: FC<MainSettingsActionProps> = ({ form }) => {
  const router = useRouter();
  const { handleSetStep } = useCreateVaultFormData();
  const { setValue } = useFormContext();
  const {
    getFieldState,
    getValues,
    formState: { isValidating, defaultValues, isValid },
  } = form;

  const stepByFields = mainSettingsFields.some((fieldName) => {
    const { invalid, isTouched } = getFieldState(fieldName);
    const currentValue = getValues(fieldName);
    const hasDefault = validateFormValue(defaultValues?.[fieldName]);

    return (
      invalid ||
      (!hasDefault && !isTouched) ||
      (hasDefault && !invalid && currentValue === undefined)
    );
  });
  const stepByConfirm = getValues('confirmMainSettings');
  const isNextStepDisabled =
    isValidating || stepByFields || !stepByConfirm || !isValid;

  const handleNavigateToRoot = () => {
    void router.push(AppPaths.main);
  };

  const handleSetNextStep = () => {
    mainSettingsFields.map((field) => setValue(field, getValues(field)));

    handleSetStep(CREATE_VAULT_FORM_STEPS.permissions);
  };

  return (
    <Container>
      <Button
        type="button"
        variant="outlined"
        onClick={handleNavigateToRoot}
        fullwidth
      >
        Cancel
      </Button>
      <Button
        type="button"
        onClick={handleSetNextStep}
        disabled={isNextStepDisabled}
        fullwidth
      >
        Continue
      </Button>
    </Container>
  );
};
