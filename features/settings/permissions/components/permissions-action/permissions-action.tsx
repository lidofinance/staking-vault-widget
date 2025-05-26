import { FC } from 'react';
import { useFormContext, useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';

import { usePermissionsData } from 'features/settings/permissions/contexts';

import { Container } from './styled';

export const PermissionsAction: FC = () => {
  const { reset } = useFormContext();
  const { isValid, isSubmitting, isDirty, disabled } = useFormState();
  const { rolesList } = usePermissionsData();
  const isClearDisabled = isSubmitting;
  const isSubmitDisabled = !isValid || !isDirty || isClearDisabled || disabled;

  const handleResetFields = () => {
    if (rolesList) {
      reset(rolesList, { keepDirtyValues: false, keepDirty: false });
    }
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
          >
            Clear changes
          </Button>
        )}
        <Button type="submit" disabled={isSubmitDisabled} fullwidth>
          {isSubmitDisabled ? 'No changes' : 'Submit transactions'}
        </Button>
      </ConnectWalletButton>
    </Container>
  );
};
