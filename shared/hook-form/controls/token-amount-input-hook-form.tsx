import { useController } from 'react-hook-form';

import { InputAmount } from 'shared/components/input-amount';

import { getTokenDisplayName } from 'utils/getTokenDisplayName';

type TokenAmountInputHookFormProps = Partial<
  React.ComponentProps<typeof InputAmount>
> & {
  isLocked?: boolean;
  maxValue?: bigint;
  token: Parameters<typeof getTokenDisplayName>[0];
  fieldName: string;
  showErrorMessage?: boolean;
};

export const TokenAmountInputHookForm = ({
  isLocked,
  maxValue,
  token,
  fieldName,
  showErrorMessage = true,
  error: errorProp,
  onBlur: onBlurProp,
  ...props
}: TokenAmountInputHookFormProps) => {
  const {
    field: { onBlur, ...field },
    fieldState: { error },
  } = useController({ name: fieldName });
  const hasErrorHighlight = !!error;
  // allows to show error state without message
  const errorMessage = hasErrorHighlight && (error?.message || true);
  return (
    <InputAmount
      {...props}
      {...field}
      onBlur={(e) => {
        onBlur();
        onBlurProp?.(e); // Call the onBlur prop if provided
      }}
      disabled={props.disabled ?? field.disabled}
      error={errorProp ?? (showErrorMessage ? errorMessage : hasErrorHighlight)}
      isLocked={isLocked}
      maxValue={maxValue}
      label={`${getTokenDisplayName(token)} amount`}
      fullwidth
    />
  );
};
