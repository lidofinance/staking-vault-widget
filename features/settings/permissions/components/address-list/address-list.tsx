import { FC, memo } from 'react';

import {
  AddressBlock,
  InputBlock,
} from 'features/settings/permissions/components';
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
