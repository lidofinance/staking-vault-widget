import { FC } from 'react';
import { Address } from 'viem';

import { AddressBadge } from 'shared/components';
import { AddressWrapper } from './styles';

interface RoleAddressProps {
  address: Address | undefined;
}

export const RoleAddress: FC<RoleAddressProps> = ({ address }) => (
  <AddressWrapper>
    <AddressBadge weight={400} address={address} symbols={21} />
  </AddressWrapper>
);
