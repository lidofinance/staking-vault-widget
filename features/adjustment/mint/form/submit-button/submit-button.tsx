import { Button } from '@lidofinance/lido-ui';
import { useFormContext } from 'react-hook-form';

export const SubmitButton = () => {
  const {
    formState: { isSubmitting, isValid },
  } = useFormContext();
  const disabled = isSubmitting && !isValid;

  return (
    <Button type="submit" disabled={disabled}>
      Mint
    </Button>
  );
};
