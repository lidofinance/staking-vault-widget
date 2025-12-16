import { FC } from 'react';

import { ConfirmationAddressBadge } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmAddress: FC<ConfirmDataItemProps> = ({
  payload,
  dataTestId,
}) => {
  invariant(typeof payload === 'string', 'payload should be a string');

  return (
    <ConfirmationAddressBadge
      address={payload}
      symbols={6}
      data-testid={dataTestId ? `${dataTestId}-addressBadge` : undefined}
    />
  );
};

export const ConfirmAddressArray: FC<ConfirmDataItemProps> = ({
  payload,
  dataTestId,
}) => {
  invariant(Array.isArray(payload), 'payload should be an array]');

  return (
    <>
      {payload.map((field, index) => {
        return (
          <ConfirmationAddressBadge
            key={field.value}
            address={field.value}
            symbols={6}
            data-testid={
              dataTestId ? `${dataTestId}-${index}-addressBadge` : null
            }
          />
        );
      })}
    </>
  );
};
