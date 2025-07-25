import { useFormContext } from 'react-hook-form';
import { Button, Input } from '@lidofinance/lido-ui';

import { useDappStatus } from 'modules/web3';
import { useInFocus } from 'shared/hooks/use-in-focus';

type AddressInputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  errorFieldName?: string;
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
  errorFieldName = fieldName,
  showErrorMessage = true,
  showRightDecorator = true,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  disabled,
  ...props
}: AddressInputHookFormProps) => {
  const { inFocus, onBlur, onFocus } = useInFocus();
  const { address } = useDappStatus();

  const { setValue, register, watch, getFieldState } = useFormContext();
  const fieldValue = watch(fieldName);

  const { error } = getFieldState(errorFieldName);

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
