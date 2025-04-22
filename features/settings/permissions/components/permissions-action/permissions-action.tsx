import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

export const PermissionsAction: FC = () => {
  const {
    reset,
    formState: { isValid, isSubmitting, isSubmitted, isDirty },
  } = useFormContext();
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting || isSubmitted;
  const isClearDisabled = !isDirty;

  return (
    <Container>
      <Button
        onClick={() => reset()}
        disabled={isClearDisabled}
        variant="outlined"
        fullwidth
      >
        Clear changes
      </Button>
      <Button type="submit" disabled={isSubmitDisabled} fullwidth>
        {isSubmitDisabled ? 'No changes' : 'Submit transactions'}
      </Button>
    </Container>
  );
};
