import { FC } from 'react';

import {
  AddressBlock,
  InputBlock,
} from 'features/settings/permissions/components';
import { AddressListWrapper } from './styles';

import { PermissionKeys } from 'features/settings/permissions/types';

export type AddressListProps = {
  permission: PermissionKeys;
  readonly?: boolean;
};

export const AddressList: FC<AddressListProps> = (props) => {
  return (
    <AddressListWrapper>
      <AddressBlock {...props} />
      <InputBlock {...props} />
    </AddressListWrapper>
  );
};
