import { FC } from 'react';
import { useRouter } from 'next/router';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { useFormContext, useFormState } from 'react-hook-form';
import { CreateVaultSchema } from 'features/create-vault/types';
import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';
import { VAULTS_OWNER_ROLES_MAP } from 'modules/vaults';
import { appPaths } from 'consts/routing';

export const MainSettingsAction: FC = () => {
  const router = useRouter();
  const { handleSetStep } = useCreateVaultFormData();
  const { getValues, setValue } = useFormContext<CreateVaultSchema>();
  const { isValidating, isValid } = useFormState<CreateVaultSchema>();

  const isNextStepDisabled = isValidating || !isValid;

  const handleNavigateToRoot = () => {
    void router.push(appPaths.myVaults);
  };

  const handleSetNextStep = () => {
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
