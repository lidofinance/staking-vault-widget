import { FC } from 'react';

import { TextBold } from './styles';

import { ConfirmDataItemProps } from './types';

export const ConfirmNumber: FC<ConfirmDataItemProps> = ({ payload }) => {
  return <TextBold>{payload}</TextBold>;
};
