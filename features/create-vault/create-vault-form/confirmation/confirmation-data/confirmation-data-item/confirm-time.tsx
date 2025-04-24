import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmTime: FC<ConfirmDataItemProps> = ({ payload }) => {
  invariant(
    typeof payload === 'string',
    '[ConfirmTime] payload should be a string',
  );
  return <TextBold>{payload} hours</TextBold>;
};
