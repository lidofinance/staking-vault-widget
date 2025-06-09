import { FC, useCallback } from 'react';
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
  const onRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  const onUpdate = useCallback(
    (index: number, field: RoleFieldSchema) => {
      update(index, field);
    },
    [update],
  );

  const isLastField =
    fields.filter((field) => field.state === 'display').length === 1;
  const isSomeFields = fields.length > 1;

  return (
    <>
      {fields.map((field, index) => {
        const { id, ...fieldData } = field;
        return (
          <RoleAddress
            key={id}
            index={index}
            field={fieldData}
            isLastField={isLastField}
            isSomeFields={isSomeFields}
            isEditable={isEditable}
            onRemove={onRemove}
            onUpdate={onUpdate}
          />
        );
      })}
    </>
  );
};
