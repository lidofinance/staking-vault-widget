import { FC } from 'react';
import { Address } from 'viem';

import { AddressBadge } from 'shared/components';

import { ConfirmDataItemProps } from './types';

export const ConfirmAddress: FC<ConfirmDataItemProps> = ({ payload }) => {
  return <AddressBadge address={payload as Address} />;
};
