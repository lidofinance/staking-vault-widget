import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Input } from '@lidofinance/lido-ui';
import { ButtonClose } from 'shared/components';
import { InputWrapper } from './styles';

export interface InputItemProps {
  permission: string;
  index: number;
  remove: (index?: number | number[]) => void;
}

export const InputItem: FC<InputItemProps> = ({
  permission,
  index,
  remove,
}) => {
  const { register, trigger } = useFormContext();
  const inputKey = `${permission}.${index}.value`;

  return (
    <InputWrapper>
      <Input
        {...register(inputKey)}
        placeholder="Ethereum address"
        onKeyUp={(e) => {
          if (e.key === 'Enter' || e.keyCode === 13) {
            void trigger(inputKey);
          }
        }}
      />

      <ButtonClose onClick={() => remove(index)} />
    </InputWrapper>
  );
};
