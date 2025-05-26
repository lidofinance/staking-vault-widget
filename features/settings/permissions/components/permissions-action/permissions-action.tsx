import { FC } from 'react';
import { useFormContext } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { ConnectWalletButton } from 'shared/wallet';
import { useDappStatus } from 'modules/web3';

import { usePermissionsData } from 'features/settings/permissions/contexts';

import { Container } from './styled';

export const PermissionsAction: FC = () => {
  const {
    reset,
    formState: { isValid, isSubmitting, isDirty, disabled },
  } = useFormContext();
  const { rolesList } = usePermissionsData();
  const { isDappActive } = useDappStatus();
  const isClearDisabled = isSubmitting || disabled;
  const isSubmitDisabled =
    !isDappActive || !isValid || !isDirty || isClearDisabled;

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
