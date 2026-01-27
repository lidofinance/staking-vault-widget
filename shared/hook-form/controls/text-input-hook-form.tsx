import { useController } from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';

import { useInFocus } from 'shared/hooks/use-in-focus';

type TextInputHookFormProps = Partial<React.ComponentProps<typeof Input>> & {
  fieldName: string;
  showErrorMessage?: boolean;
  showRightDecorator?: boolean;
};

export const TextInputHookForm = ({
  fieldName,
  showErrorMessage = true,
  onBlur: onBlurProp,
  onFocus: onFocusProp,
  disabled,
  ...props
}: TextInputHookFormProps) => {
  const { inFocus, onBlur, onFocus } = useInFocus();
  const {
    field,
    fieldState: { error },
  } = useController({ name: fieldName, disabled });

  const shouldShowErrorMessage = showErrorMessage && inFocus && !!error;
  const errorMessage = error?.message as string;

  return (
    <Input
      type="text"
      {...field}
      onBlur={(e) => {
        field.onBlur();
        onBlur();
        onBlurProp?.(e);
      }}
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
