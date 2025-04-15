import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';

export const ConfirmPercent: FC<ConfirmDataItemProps> = ({ payload }) => {
  return <TextBold>{payload}%</TextBold>;
};
