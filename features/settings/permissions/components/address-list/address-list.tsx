import { FC, memo } from 'react';

import { AddressBlock } from 'features/settings/permissions/components/address-list/address-block';
import { InputBlock } from 'features/settings/permissions/components/address-list/input-block';
import { AddressListWrapper } from './styles';

import { EDITABLE_PERMISSIONS } from 'consts/roles';

export interface AddressListProps {
  permission: EDITABLE_PERMISSIONS;
}

export const AddressList: FC<AddressListProps> = memo(({ permission }) => {
  return (
    <AddressListWrapper>
      <AddressBlock permission={permission} />
      <InputBlock permission={permission} />
    </AddressListWrapper>
  );
});
