import { FC } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

export const PermissionsAction: FC = () => {
  const { step, handleSetStep } = useCreateVaultFormData();

  const handleSetPrevStep = () => {
    const prevStep = step - 1;
    handleSetStep(prevStep);
  };

  const handleSetNextStep = () => {
    const nextStep = step + 1;
    handleSetStep(nextStep);
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
