import { Button } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isSubmitting, isValid, isDirty },
  } = useFormContext();
  return (
    <Button disabled={isSubmitting || !isValid || !isDirty}>Supply</Button>
  );
};
