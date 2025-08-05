import type { ComponentProps, ReactNode } from 'react';
import { type RegisterOptions, useFormContext } from 'react-hook-form';

import { CheckBoxStyled } from './styles';

type CheckBoxHookFormProps = {
  fieldName: string;
  label?: ReactNode;
  error?: boolean;
} & RegisterOptions &
  Partial<Pick<ComponentProps<typeof CheckBoxStyled>, 'style' | 'className'>>;

export const CheckboxHookForm = ({
  fieldName,
  label,
  style,
  className,
  ...registerOptions
}: CheckBoxHookFormProps) => {
  const { getFieldState } = useFormContext();
  const hasError = Boolean(getFieldState(fieldName).error);
  const { register } = useFormContext();
  return (
    <CheckBoxStyled
      style={style}
      className={className}
      error={hasError}
      data-testid="mintStethCheckbox"
      label={label}
      {...register(fieldName, registerOptions)}
    />
  );
};
