import { FC } from 'react';

import {
  AddressBlock,
  InputBlock,
} from 'features/settings/permissions/components';
import { AddressListWrapper } from './styles';

import { PermissionKeys } from 'features/settings/permissions/types';

export type AddressListProps = {
  permission: PermissionKeys;
};

export const AddressList: FC<AddressListProps> = ({ permission }) => {
  return (
    <AddressListWrapper>
      <AddressBlock permission={permission} />
      <InputBlock permission={permission} />
    </AddressListWrapper>
  );
};
