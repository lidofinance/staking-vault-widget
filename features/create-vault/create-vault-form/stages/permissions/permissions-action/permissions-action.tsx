import { FC } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';
import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';

export const PermissionsAction: FC = () => {
  const { handleSetStep } = useCreateVaultFormData();

  const handleSetPrevStep = () => {
    handleSetStep(CREATE_VAULT_FORM_STEPS.main);
  };

  const handleSetNextStep = () => {
    handleSetStep(CREATE_VAULT_FORM_STEPS.confirm);
  };

  return (
    <Container>
      <Button onClick={handleSetPrevStep} variant="outlined" fullwidth>
        Back
      </Button>
      <Button onClick={handleSetNextStep} fullwidth>
        Create vault
      </Button>
    </Container>
  );
};
