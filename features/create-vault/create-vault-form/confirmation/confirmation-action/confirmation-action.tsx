import { FC } from 'react';

import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styles';

export const ConfirmationAction: FC = () => {
  const { step, handleSetStep } = useCreateVaultFormData();

  const handleSetPrevStep = () => {
    const prevStep = step - 1;
    handleSetStep(prevStep);
  };

  const handleCreateVault = () => {
    console.info('handleCreateVault', step);
  };

  return (
    <Container>
      <Button onClick={handleSetPrevStep} variant="outlined" fullwidth>
        Back
      </Button>
      <Button onClick={handleCreateVault} fullwidth>
        Create vault
      </Button>
    </Container>
  );
};
