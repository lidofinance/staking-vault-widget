import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import { Wrapper } from './styles';
import { PermissionField, PermissionKeys } from 'features/create-vault/types';
import { AddressItem } from '../address-item';

export type AddressBlockProps = {
  permission: PermissionKeys;
};

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
