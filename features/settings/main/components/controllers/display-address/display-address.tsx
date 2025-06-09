import { FC } from 'react';
import { UseFieldArrayRemove, UseFieldArrayUpdate } from 'react-hook-form';

import { RoleAddress } from './role-address';

import {
  RoleFieldSchema,
  EditMainSettingsSchema,
} from 'features/settings/main/types';

interface DisplayAddressProps {
  isEditable: boolean;
  fields: (Record<'id', string> & RoleFieldSchema)[];
  remove: UseFieldArrayRemove;
  update: UseFieldArrayUpdate<EditMainSettingsSchema>;
}

export const DisplayAddress: FC<DisplayAddressProps> = ({
  isEditable,
  fields,
  remove,
  update,
}) => {
  const onRemove = (index: number) => {
    remove(index);
  };

  const onUpdate = (index: number, field: RoleFieldSchema) => {
    update(index, field);
  };

  const isLastField =
    fields.filter((field) => field.state === 'display').length === 1;
  const isSomeFields = fields.length > 1;

  return (
    <>
      {!!fields &&
        fields.map((field, index) => {
          const { id, ...fieldData } = field;
          return (
            <RoleAddress
              key={id}
              field={fieldData}
              isLastField={isLastField}
              isSomeFields={isSomeFields}
              index={index}
              isEditable={isEditable}
              onRemove={onRemove}
              onUpdate={onUpdate}
            />
          );
        })}
    </>
  );
};
