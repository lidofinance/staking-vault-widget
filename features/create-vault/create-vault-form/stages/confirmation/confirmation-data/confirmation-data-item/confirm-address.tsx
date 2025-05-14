import { FC } from 'react';

import { AddressBadge } from 'shared/components';
import { AddressList } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmAddress: FC<ConfirmDataItemProps> = ({ payload }) => {
  if (Array.isArray(payload)) {
    return (
      <AddressList>
        {payload.map((field) => {
          return (
            <AddressBadge
              key={field.account}
              address={field.account}
              symbols={6}
            />
          );
        })}
      </AddressList>
    );
  }
  invariant(typeof payload === 'string', 'payload should be a string');
  return <AddressBadge address={payload} symbols={6} />;
};
