import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmPercent: FC<ConfirmDataItemProps> = ({ payload }) => {
  if (!payload) return null;
  invariant(
    typeof payload === 'number' || typeof payload === 'string',
    'Payload must be a string | number',
  );
  return <TextBold>{payload}%</TextBold>;
};
