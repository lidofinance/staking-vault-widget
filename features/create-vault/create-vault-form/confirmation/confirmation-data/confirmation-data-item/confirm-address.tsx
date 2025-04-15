import { FC } from 'react';
import { Address } from 'viem';

import { AddressBadge } from 'shared/components';
import { AddressList } from './styles';

import { ConfirmDataItemProps } from './types';

export const ConfirmAddress: FC<ConfirmDataItemProps> = ({ payload }) => {
  if (Array.isArray(payload)) {
    return (
      <AddressList>
        {(payload as Address[]).map((address) => {
          return <AddressBadge key={address} address={address} symbols={6} />;
        })}
      </AddressList>
    );
  }

  return <AddressBadge address={payload} symbols={6} />;
};
