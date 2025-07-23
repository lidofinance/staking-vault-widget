import { RegisterOptions, useFormContext } from 'react-hook-form';

import { CheckBoxStyled } from './styles';

type CheckBoxHookFormProps = {
  fieldName: string;
  label?: string;
} & RegisterOptions;

export const CheckboxHookForm = ({
  fieldName,
  label,
  ...registerOptions
}: CheckBoxHookFormProps) => {
  const { register } = useFormContext();
  return (
    <CheckBoxStyled
      data-testid="mintStethCheckbox"
      label={label}
      {...register(fieldName, registerOptions)}
    />
  );
};
