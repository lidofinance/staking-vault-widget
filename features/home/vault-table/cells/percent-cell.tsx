import { FC } from 'react';

import { Percent } from './styles';

import { formatPercent } from 'utils/format-number';
import { BaseCellProps } from '../types';

export const PercentCell: FC<BaseCellProps<number>> = (props) => {
  const { value } = props;
  const percent = formatPercent.format(value);

  return <Percent value={value}>{percent}</Percent>;
};
