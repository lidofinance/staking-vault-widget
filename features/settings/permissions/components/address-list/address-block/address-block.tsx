import { FC } from 'react';
import { useFieldArray } from 'react-hook-form';

import { AddressItem } from 'features/settings/permissions/components/address-list/address-item';
import { Wrapper } from './styles';

import {
  EditPermissionsSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';
import { InputBlock } from '../input-block';

export type AddressBlockProps = {
  permission: PermissionKeys;
  readonly?: boolean;
};

export const AddressBlock: FC<AddressBlockProps> = ({
  permission,
  readonly,
}) => {
  const { fields, update, append } = useFieldArray<EditPermissionsSchema>({
    name: permission,
  });

  return (
    <Wrapper>
      {fields.map((field, index) => {
        return (
          <AddressItem
            key={field.id}
            field={field}
            index={index}
            readonly={readonly}
            update={update}
          />
        );
      })}

      <InputBlock fields={fields} readonly={readonly} append={append} />
    </Wrapper>
  );
};
