import type { ComponentProps, ReactNode } from 'react';
import {
  type RegisterOptions,
  useFormContext,
  useFormState,
} from 'react-hook-form';

import { CheckBoxStyled } from './styles';

type CheckBoxHookFormProps = {
  fieldName: string;
  label?: ReactNode;
  error?: boolean;
  'data-testid'?: string;
} & RegisterOptions &
  Partial<Pick<ComponentProps<typeof CheckBoxStyled>, 'style' | 'className'>>;

export const CheckboxHookForm = ({
  fieldName,
  label,
  style,
  className,
  'data-testid': dataTestId,
  ...registerOptions
}: CheckBoxHookFormProps) => {
  const { register } = useFormContext();
  const { disabled, errors } = useFormState({ name: fieldName });
  const hasError = Boolean(errors);

  return (
    <CheckBoxStyled
      style={style}
      className={className}
      error={hasError}
      data-testid={dataTestId}
      label={label}
      disabled={disabled}
      {...register(fieldName, registerOptions)}
    />
  );
};
