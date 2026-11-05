import { useFormContext, useFormState } from 'react-hook-form';
import { Button, Input } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { useInFocus } from 'shared/hooks/use-in-focus';

type AddressInputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  errorFieldName?: string;
  showErrorMessage?: boolean;
  showRightDecorator?: boolean;
  deps?: string | string[];
};

const safeIsAddressEqual = (a: string, b: string) => {
  const normA = a?.toLowerCase().trim();
  const normB = b?.toLowerCase().trim();
  return normA === normB;
};

export const AddressInputHookForm = ({
  fieldName,
  errorFieldName = fieldName,
  showErrorMessage = true,
  showRightDecorator = true,
  deps,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  disabled,
  rightDecorator = null,
  ...props
}: AddressInputHookFormProps) => {
  const { inFocus, onBlur, onFocus } = useInFocus();
  const { address } = useDappStatus();

  const { setValue, register, watch, getFieldState } = useFormContext();
  const fieldValue = watch(fieldName);

  const formState = useFormState({ name: errorFieldName });
  const { error } = getFieldState(errorFieldName, formState);

  const shouldShowErrorMessage = showErrorMessage && inFocus && !!error;
  const errorMessage = error?.message as string;

  const customRightDecorator = showRightDecorator ? (
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
        deps,
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
      rightDecorator={rightDecorator || customRightDecorator}
      {...props}
    />
  );
};
