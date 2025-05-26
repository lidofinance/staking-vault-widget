import { FC } from 'react';
import { useController, useFormState } from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { InputWrapper } from './styles';

export interface InputItemProps {
  name: string;
  editLabel: string;
  index: number;
  remove: (index?: number | number[]) => void;
}

export const InputItem: FC<InputItemProps> = ({
  name,
  editLabel,
  index,
  remove,
}) => {
  const { errors } = useFormState();
  const inputKey = `${name}.${index}.value`;
  const { field } = useController({ name: inputKey });

  // @ts-expect-error react-hook-form types incompatible to zod schema validation
  const errorMessage = errors?.[name]?.[index]?.value.message;

  return (
    <InputWrapper>
      <Input {...field} label={editLabel} error={errorMessage} />

      <ButtonClose onClick={() => remove(index)} />
    </InputWrapper>
  );
};
