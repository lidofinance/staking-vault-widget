import { FC } from 'react';
import { useFieldArray } from 'react-hook-form';

import { InputBlockWrapper } from './styles';
import { InputItem } from '../input-item';

export interface InputBlockProps {
  permission: string;
}

export const InputBlock: FC<InputBlockProps> = ({ permission }) => {
  const { fields } = useFieldArray({ name: permission });

  if (fields.length === 0) {
    return null;
  }

  return (
    <InputBlockWrapper>
      {fields.map((field, index) => (
        <InputItem key={field.id} permission={permission} index={index} />
      ))}
    </InputBlockWrapper>
  );
};
