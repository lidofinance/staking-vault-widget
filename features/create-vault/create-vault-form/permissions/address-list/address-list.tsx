import { FC } from 'react';

import { AddressBlock } from 'features/create-vault/create-vault-form/permissions/address-list/address-block';
import { InputBlock } from 'features/create-vault/create-vault-form/permissions/address-list/input-block';
import { AddressListWrapper } from './styles';
import { PermissionKeys } from 'features/create-vault/types';

export interface AddressListProps {
  permission: PermissionKeys;
}

export const AddressList: FC<AddressListProps> = ({ permission }) => {
  return (
    <AddressListWrapper>
      <AddressBlock permission={permission} />
      <InputBlock permission={permission} />
    </AddressListWrapper>
  );
};
