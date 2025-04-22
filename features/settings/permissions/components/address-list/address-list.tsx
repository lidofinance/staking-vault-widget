import { FC, memo } from 'react';

import { AddressBlock } from 'features/settings/permissions/components/address-list/address-block';
import { InputBlock } from 'features/settings/permissions/components/address-list/input-block';
import { AddressListWrapper } from './styles';

import { PermissionsKeys } from 'features/settings/permissions/types';

export interface AddressListProps {
  permission: PermissionsKeys;
}

export const AddressList: FC<AddressListProps> = memo(({ permission }) => {
  return (
    <AddressListWrapper>
      <AddressBlock permission={permission} />
      <InputBlock permission={permission} />
    </AddressListWrapper>
  );
});
