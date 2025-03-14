import { FC } from 'react';
import { type FieldArrayWithId } from 'react-hook-form';

import { InputBlockWrapper } from './styles';
import { InputItem } from '../input-item';

export interface InputBlockProps {
  permission: string;
  fields: FieldArrayWithId[];
  remove: (index?: number | number[]) => void;
}

export const InputBlock: FC<InputBlockProps> = ({
  permission,
  fields,
  remove,
}) => {
  if (fields.length === 0) {
    return null;
  }

  return (
    <InputBlockWrapper>
      {fields.map((field, index) => (
        <InputItem
          remove={remove}
          key={field.id}
          permission={permission}
          index={index}
        />
      ))}
    </InputBlockWrapper>
  );
};
