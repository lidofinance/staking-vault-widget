import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { AddressItem } from 'features/settings/permissions/components/address-list/address-item';
import { Wrapper } from './styles';

import {
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';

export interface AddressBlockProps {
  permission: PermissionKeys;
}

export const AddressBlock: FC<AddressBlockProps> = ({ permission }) => {
  const { watch } = useFormContext();
  const fields = (watch(permission) ?? []) as FieldSchema[];

  return (
    <Wrapper>
      {fields.map((field, index) => {
        return (
          <AddressItem
            key={field.account}
            field={field}
            index={index}
            permission={permission}
          />
        );
      })}
    </Wrapper>
  );
};

// addresses => { account: address, group: 'settled' | 'eventual', state: 'restore' | 'grant' | 'remove' | 'display' }
