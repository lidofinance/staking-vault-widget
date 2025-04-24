import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmPercent: FC<ConfirmDataItemProps> = ({ payload }) => {
  invariant(
    typeof payload === 'string',
    '[ConfirmPercent] payload should be a string',
  );
  return <TextBold>{payload}%</TextBold>;
};
