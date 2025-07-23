import { useFormContext, useFormState } from 'react-hook-form';
import { Button, Input } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { useInFocus } from 'shared/hooks/use-in-focus';

type TokenAmountInputHookFormProps = Partial<
  React.ComponentProps<typeof Input>
> & {
  fieldName: string;
  showErrorMessage?: boolean;
  showRightDecorator?: boolean;
};

const safeIsAddressEqual = (a: string, b: string) => {
  const normA = a?.toLowerCase().trim();
  const normB = b?.toLowerCase().trim();
  return normA === normB;
};

export const AddressInputHookForm = ({
  fieldName,
  showErrorMessage = true,
  showRightDecorator = true,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  disabled,
  ...props
}: TokenAmountInputHookFormProps) => {
  const { inFocus, onBlur, onFocus } = useInFocus();
  const { address } = useDappStatus();
  const error = useFormState().errors[fieldName];

  const { setValue, register, watch } = useFormContext();
  const fieldValue = watch(fieldName);

  const shouldShowErrorMessage = showErrorMessage && inFocus && !!error;
  const errorMessage = error?.message as string;

  const rightDecorator = showRightDecorator ? (
    <Button
      size="xxs"
      variant="translucent"
      onClick={() => {
        address &&
          setValue(fieldName, address, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
          });
      }}
      disabled={disabled || !address || safeIsAddressEqual(fieldValue, address)}
      data-testid="currentAddressBtn"
    >
      Current address
    </Button>
  ) : null;

  return (
    <Input
      {...register(fieldName, {
        onBlur: (e) => {
          onBlur();
          onBlurProp?.(e);
        },
        disabled,
      })}
      onFocus={(e) => {
        onFocus();
        onFocusProp?.(e);
      }}
      style={{ display: props.hidden ? 'none' : undefined }}
      error={shouldShowErrorMessage ? errorMessage : !!error}
      fullwidth
      rightDecorator={rightDecorator}
      {...props}
    />
  );
};
