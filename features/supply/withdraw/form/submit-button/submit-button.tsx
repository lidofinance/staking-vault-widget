import { Button } from '@lidofinance/lido-ui';

import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isValid, isSubmitting, isDirty },
  } = useFormContext();
  const disabled = isSubmitting || !isValid || !isDirty;

  return (
    <Button type="submit" disabled={disabled}>
      Withdraw
    </Button>
  );
};
