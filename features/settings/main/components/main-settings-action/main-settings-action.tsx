import { FC, useMemo } from 'react';
import { Button } from '@lidofinance/lido-ui';
import { Container } from './styled';

import { useFormContext } from 'react-hook-form';

export const MainSettingsAction: FC = () => {
  const {
    reset,
    watch,
    formState: { isValid, isDirty, isSubmitting, isSubmitted },
  } = useFormContext();
  const isClearDisabled = !isDirty;
  const isSubmitDisabled = !isValid || !isDirty || isSubmitting || isSubmitted;
  const formFields = watch();
  const buttonText = useMemo(() => {
    let counter = 0;
    if (
      formFields.defaultAdmin.length > 0 ||
      formFields.nodeOperatorManager.length > 0
    ) {
      counter++;
    }

    if (formFields.nodeOperatorFeeBP.length > 0) {
      counter++;
    }

    if (formFields.confirmExpiry.length > 0) {
      counter++;
    }

    if (counter) {
      return `Submit ${counter} transaction${counter > 1 ? 's' : ''}`;
    }

    return 'No changes';
  }, [formFields]);

  return (
    <Container>
      <Button
        type="button"
        variant="outlined"
        disabled={isClearDisabled}
        onClick={() => reset()}
        fullwidth
      >
        Clear changes
      </Button>
      <Button type="submit" disabled={isSubmitDisabled} fullwidth>
        {buttonText}
      </Button>
    </Container>
  );
};
