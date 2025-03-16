import { FC, memo } from 'react';

import { AddressBlock } from 'features/create-vault/create-vault-form/permissions/address-list/address-block';
import { InputBlock } from 'features/create-vault/create-vault-form/permissions/input-block';
import { AddressListWrapper } from './styles';

export interface AddressListProps {
  permission: string;
}

export const AddressList: FC<AddressListProps> = memo(({ permission }) => {
  return (
    <AddressListWrapper>
      <AddressBlock permission={permission} />
      <InputBlock permission={permission} />
    </AddressListWrapper>
  );
});
