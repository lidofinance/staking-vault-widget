import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { AddressItem } from 'features/settings/permissions/components/address-list/address-item';
import { Wrapper } from './styles';

import {
  FieldSchema,
  PermissionKeys,
} from 'features/settings/permissions/types';

export type AddressBlockProps = {
  permission: PermissionKeys;
  readonly?: boolean;
};

export const AddressBlock: FC<AddressBlockProps> = ({
  permission,
  readonly,
}) => {
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
            readonly={readonly}
            permission={permission}
          />
        );
      })}
    </Wrapper>
  );
};

// addresses => { account: address, group: 'settled' | 'eventual', state: 'restore' | 'grant' | 'remove' | 'display' }
