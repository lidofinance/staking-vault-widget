import { FC } from 'react';
import { useRouter } from 'next/router';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { useFormContext, UseFormReturn } from 'react-hook-form';
import { validateFormValue } from 'utils/validate-form-value';
import { VaultMainSettingsType } from 'features/create-vault/types';
import {
  CREATE_VAULT_FORM_STEPS,
  mainSettingsFields,
} from 'features/create-vault/consts';
import { VAULTS_OWNER_ROLES_MAP } from 'modules/vaults';
import { appPaths } from 'consts/routing';

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
    void router.push(appPaths.myVaults);
  };

  const handleSetNextStep = () => {
    mainSettingsFields.forEach((field) => setValue(field, getValues(field)));

    // TODO: bring back permissions step
    // This assigns default values to the roles except for NO manager roles
    const vaultManager = getValues('defaultAdmin');
    const vaultMangerRoles = Object.keys(VAULTS_OWNER_ROLES_MAP).reduce(
      (acc, key) => {
        acc[key] = [{ account: vaultManager, state: 'grant' }];
        return acc;
      },
      {} as any,
    );

    setValue('roles', vaultMangerRoles);

    handleSetStep(CREATE_VAULT_FORM_STEPS.confirm);
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
