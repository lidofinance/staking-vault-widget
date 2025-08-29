import { useFormContext } from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';

import { useInFocus } from 'shared/hooks/use-in-focus';

type TextInputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  errorFieldName?: string;
  showErrorMessage?: boolean;
  showRightDecorator?: boolean;
};

export const TextInputHookForm = ({
  fieldName,
  errorFieldName = fieldName,
  showErrorMessage = true,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  disabled,
  ...props
}: TextInputHookFormProps) => {
  const { inFocus, onBlur, onFocus } = useInFocus();

  const { register, getFieldState } = useFormContext();

  const { error } = getFieldState(errorFieldName);

  const shouldShowErrorMessage = showErrorMessage && inFocus && !!error;
  const errorMessage = error?.message as string;

  return (
    <Input
      type="text"
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
      {...props}
    />
  );
};
