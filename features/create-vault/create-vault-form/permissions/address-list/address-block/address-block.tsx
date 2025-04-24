import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { AddressItem } from 'features/create-vault/create-vault-form/permissions/address-list/address-item';
import { Wrapper } from './styles';
import { PermissionField, PermissionKeys } from 'features/create-vault/types';

export interface AddressBlockProps {
  permission: PermissionKeys;
}

export const AddressBlock: FC<AddressBlockProps> = ({ permission }) => {
  const { watch } = useFormContext();
  const fieldsWatch = watch(`roles.${permission}`) as PermissionField[];

  if (!fieldsWatch?.length) {
    return null;
  }

  return (
    <Wrapper>
      {fieldsWatch.map((field, index) => {
        return (
          <AddressItem
            key={field.account}
            index={index}
            permission={permission}
            field={field}
          />
        );
      })}
    </Wrapper>
  );
};
