import { FC, useEffect } from 'react';
import { useCreateVaultFormData } from 'features/create-vault/create-vault-form/create-vault-form-context';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styles';
import { useFormContext } from 'react-hook-form';
import { CREATE_VAULT_FORM_STEPS } from '../../../consts';

export const ConfirmationAction: FC = () => {
  const { handleSetStep } = useCreateVaultFormData();
  const {
    trigger,
    formState: { isValid },
  } = useFormContext();

  useEffect(() => {
    // validate core form to unlock submit button
    void trigger();
  }, [trigger]);

  const handleSetPrevStep = () => {
    // TODO: bring back permissions step
    // handleSetStep(CREATE_VAULT_FORM_STEPS.permissions);
    handleSetStep(CREATE_VAULT_FORM_STEPS.main);
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
