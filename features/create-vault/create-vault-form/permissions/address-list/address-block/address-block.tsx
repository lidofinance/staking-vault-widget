import { FC, useCallback } from 'react';
import { useFormContext, useFieldArray } from 'react-hook-form';

import { AddressItem } from 'features/create-vault/create-vault-form/permissions/address-list/address-item';
import { Wrapper } from './styles';

export interface AddressBlockProps {
  permission: string;
}

export const AddressBlock: FC<AddressBlockProps> = ({ permission }) => {
  const { control, watch } = useFormContext();
  const { remove } = useFieldArray({ control, name: permission });
  const fieldsWatch = watch(permission) as string[];

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  if (fieldsWatch.length === 0) {
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
