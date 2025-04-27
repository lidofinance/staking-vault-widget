import { FC } from 'react';

import { useFieldArray, useFormContext } from 'react-hook-form';

import { Plus } from '@lidofinance/lido-ui';
import { InputItem } from './input-item';
import { ButtonContainer, EditWrapper } from './styles';

interface EditPropertyProps {
  name: string;
  actionText: string;
  editLabel: string;
}

export const EditProperty: FC<EditPropertyProps> = ({
  actionText,
  name,
  editLabel,
}) => {
  const { control, watch } = useFormContext();
  const { append, fields, remove } = useFieldArray({ control, name });
  const fieldsInfo = watch(name) as { value: string }[];
  const showAddButton = !fieldsInfo || fieldsInfo.length === 0;

  return (
    <EditWrapper>
      {fields.map((field, index) => {
        return (
          <InputItem
            name={name}
            editLabel={editLabel}
            key={field.id}
            remove={remove}
            index={index}
          />
        );
      })}
      {showAddButton && (
        <ButtonContainer
          color="primary"
          icon={<Plus />}
          size="md"
          variant="ghost"
          type="button"
          onClick={() => append({ value: '' })}
        >
          {actionText}
        </ButtonContainer>
      )}
    </EditWrapper>
  );
};
