import { FC } from 'react';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';
import { useFormControllerContext } from 'shared/hook-form/form-controller';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styles';

export const ConfirmationAction: FC = () => {
  const { step, handleSetStep } = useCreateVaultFormData();
  const { onSubmit } = useFormControllerContext();

  const handleSetPrevStep = () => {
    const prevStep = step - 1;
    handleSetStep(prevStep);
  };

  return (
    <Container>
      <Button
        onClick={handleSetPrevStep}
        variant="outlined"
        type="button"
        fullwidth
      >
        Back
      </Button>
      <Button onClick={onSubmit} type="submit" fullwidth>
        Create vault
      </Button>
    </Container>
  );
};
