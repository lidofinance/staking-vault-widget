import { useFormState } from 'react-hook-form';
import { Button } from '@lidofinance/lido-ui';

import { RadioSelector } from '../custom/radio-selector';
import { useData } from './context/data-provider';

export const RadioForm = () => {
  const data = useData();
  const { isValid, isDirty, isSubmitting, isValidating, disabled } =
    useFormState();

  const isDisabled =
    !isValid || !isDirty || isSubmitting || isValidating || disabled;

  return (
    <>
      <RadioSelector
        data={data?.someField}
        radioType="someField"
        title="Some field"
      />
      <br />
      <Button type="submit" fullwidth disabled={isDisabled}>
        Submit
      </Button>
    </>
  );
};
