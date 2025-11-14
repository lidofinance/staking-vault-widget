import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';

import { useAllowTransaction } from 'features/settings/permissions/hooks';

import { Container } from './styled';

export const PermissionsAction: FC = () => {
  const { reset } = useFormContext();
  const { isValid, isSubmitting, isDirty, disabled, isLoading } =
    useFormState();
  const isAllowedTx = useAllowTransaction();
  const isClearDisabled = isSubmitting;
  const isSubmitDisabled =
    (!isValid || !isDirty || isClearDisabled || disabled || isLoading) &&
    !isAllowedTx;

  const handleResetFields = () => {
    // bug in RHF, if keepIsValid is not set true, isDirty is not updated after reset and append
    reset(undefined, { keepIsValid: true });
  };

  return (
    <Container>
      <ConnectWalletButton>
        {isDirty && (
          <Button
            onClick={handleResetFields}
            disabled={isClearDisabled}
            variant="outlined"
            fullwidth
            data-testid="permissions-clearButton"
          >
            Clear changes
          </Button>
        )}
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          fullwidth
          data-testid="permissions-submitButton"
        >
          {isSubmitDisabled ? 'No changes' : 'Submit transactions'}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
