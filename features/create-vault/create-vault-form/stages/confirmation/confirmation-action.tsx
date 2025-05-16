import { useFormContext } from 'react-hook-form';

import { Connect } from 'shared/wallet';

import { CREATE_VAULT_FORM_STEPS } from 'features/create-vault/consts';
import {
  ActionButton,
  ActionButtonContainer,
} from 'features/create-vault/create-vault-form/styles';

import type { CreateVaultSchema } from 'features/create-vault/types';
import type { FC } from 'react';

type ConfirmationActionProps = {
  isDisabled?: boolean;
  isConnected?: boolean;
};

export const ConfirmationAction: FC<ConfirmationActionProps> = ({
  isDisabled,
  isConnected,
}) => {
  const {
    formState: { isValid, isSubmitting },
    setValue,
  } = useFormContext<CreateVaultSchema>();

  const handleSetPrevStep = () => {
    setValue('step', CREATE_VAULT_FORM_STEPS.main);
  };

  return (
    <ActionButtonContainer>
      <ActionButton
        onClick={handleSetPrevStep}
        variant="outlined"
        type="button"
        fullwidth
      >
        Back
      </ActionButton>
      {isConnected ? (
        <ActionButton
          loading={isSubmitting}
          disabled={isDisabled || !isValid}
          type="submit"
          fullwidth
        >
          Create vault and supply 1 ETH
        </ActionButton>
      ) : (
        <Connect />
      )}
    </ActionButtonContainer>
  );
};
