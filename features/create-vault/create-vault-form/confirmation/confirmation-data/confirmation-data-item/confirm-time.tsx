import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';

export const ConfirmTime: FC<ConfirmDataItemProps> = ({ payload }) => {
  return <TextBold>{payload} hours</TextBold>;
};
