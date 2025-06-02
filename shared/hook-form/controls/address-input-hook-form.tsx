import { useState } from 'react';
import { useController, useFormContext } from 'react-hook-form';
import { Button, Input } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';

type TokenAmountInputHookFormProps = Partial<
  React.ComponentProps<typeof Input>
> & {
  fieldName: string;
  showErrorMessage?: boolean;
};

const safeIsAddressEqual = (a: string, b: string) => {
  const normA = a?.toLowerCase().trim();
  const normB = b?.toLowerCase().trim();
  return normA === normB;
};

export const AddressInputHookForm = ({
  fieldName,
  showErrorMessage = true,
  error: errorProp,
  onBlur: onBlurProp,
  disabled,
  ...props
}: TokenAmountInputHookFormProps) => {
  const [inFocus, setInFocus] = useState(false);
  const { address } = useDappStatus();
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName });
  const { setValue } = useFormContext();

  const shouldShowErrorMessage = showErrorMessage && inFocus && !!error;
  const errorMessage = error?.message;

  const rightDecorator = (
    <Button
      size="xxs"
      variant="translucent"
      onClick={() => {
        address &&
          setValue(field.name, address, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
      }}
      disabled={
        field.disabled || !address || safeIsAddressEqual(field.value, address)
      }
    >
      Current address
    </Button>
  );

  return (
    <Input
      {...field}
      onFocus={() => setInFocus(true)}
      onBlur={(e) => {
        setInFocus(false);
        field.onBlur();
        onBlurProp?.(e);
      }}
      style={{ display: props.hidden ? 'none' : undefined }}
      disabled={field.disabled}
      error={shouldShowErrorMessage ? errorMessage : !!error}
      fullwidth
      rightDecorator={rightDecorator}
      {...props}
    />
  );
};
