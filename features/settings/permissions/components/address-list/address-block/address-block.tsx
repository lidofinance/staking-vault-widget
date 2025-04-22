import { FC, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { AddressItem } from 'features/settings/permissions/components/address-list/address-item';
import { Wrapper } from './styles';

import { PermissionsKeys } from 'features/settings/permissions/types';

export interface AddressBlockProps {
  permission: PermissionsKeys;
}

export const AddressBlock: FC<AddressBlockProps> = ({ permission }) => {
  const { control, watch } = useFormContext();
  const { remove } = useFieldArray({ control, name: permission });
  const fieldsWatch = watch(permission) as PermissionsKeys[];

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  if (!fieldsWatch || fieldsWatch.length === 0) {
    return null;
  }

  return (
    <Wrapper>
      {fieldsWatch.map((value, index) => {
        return (
          <AddressItem
            key={value}
            address={value}
            index={index}
            remove={handleRemove}
          />
        );
      })}
    </Wrapper>
  );
};
