import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';
import invariant from 'tiny-invariant';

export const ConfirmNumber: FC<ConfirmDataItemProps> = ({ payload }) => {
  invariant(
    typeof payload === 'string',
    '[ConfirmNumber] payload should be a string',
  );
  return <TextBold>{payload}</TextBold>;
};
