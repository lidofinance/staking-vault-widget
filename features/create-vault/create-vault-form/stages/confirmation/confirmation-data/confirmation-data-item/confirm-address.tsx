import { FC } from 'react';

import { AddressBadge } from 'shared/components';
import { AddressList } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmAddress: FC<ConfirmDataItemProps> = ({ payload }) => {
  invariant(typeof payload === 'string', 'payload should be a string');
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

  return <AddressBadge address={payload} symbols={6} />;
};

export const ConfirmAddressArray: FC<ConfirmDataItemProps> = ({ payload }) => {
  invariant(Array.isArray(payload), 'payload should be an array]');

  return (
    <AddressList>
      {payload.map((field) => {
        return (
          <AddressBadge key={field.value} address={field.value} symbols={6} />
        );
      })}
    </AddressList>
  );
};
