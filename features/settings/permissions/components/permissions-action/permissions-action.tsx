import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { usePermissionsData } from 'features/settings/permissions/contexts';

export const PermissionsAction: FC = () => {
  const {
    reset,
    formState: { isValid, isSubmitting, isDirty, disabled },
  } = useFormContext();
  const { rolesList } = usePermissionsData();
  const isClearDisabled = isSubmitting || disabled;
  const isSubmitDisabled = !isValid || !isDirty || isClearDisabled;

  const handleResetFields = () => {
    if (rolesList) {
      reset(structuredClone(rolesList));
    }
  };

  return (
    <Container>
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
    </Container>
  );
};
