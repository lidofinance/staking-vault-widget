import { FC } from 'react';

import type { PermissionKeys } from 'features/create-vault/types';

import { AddressBlock } from './address-block';
import { InputBlock } from './input-block';
import { AddressListWrapper } from './styles';

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
