import { FC } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import { Input, Close } from '@lidofinance/lido-ui';
import { Button, InputWrapper } from './styles';

export interface InputItemProps {
  permission: string;
  index: number;
}

export const InputItem: FC<InputItemProps> = ({ permission, index }) => {
  const { register, trigger } = useFormContext();
  const { remove } = useFieldArray({ name: permission });

  return (
    <InputWrapper>
      <Input
        {...register(`${permission}.${index}.value`)}
        placeholder="Ethereum address"
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.keyCode === 13) {
            void trigger(`${permission}.${index}.value`);
          }
        }}
      />

      <Button onClick={() => remove(index)} type="button">
        <Close />
      </Button>
    </InputWrapper>
  );
};
