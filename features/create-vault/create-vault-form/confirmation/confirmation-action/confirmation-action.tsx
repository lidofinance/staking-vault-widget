import { FC, useEffect } from 'react';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styles';
import { useFormContext } from 'react-hook-form';

export const ConfirmationAction: FC = () => {
  const { step, handleSetStep } = useCreateVaultFormData();
  const {
    trigger,
    formState: { isValid },
  } = useFormContext();

  useEffect(() => {
    // validate core form to unlock submit button
    void trigger();
  }, [trigger]);

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
      <Button disabled={!isValid} type="submit" fullwidth>
        Create vault
      </Button>
    </Container>
  );
};
