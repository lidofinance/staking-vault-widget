import { FC } from 'react';

import { Percent } from './styles';

import { formatPercent } from 'utils/format-number';
import { BaseCellProps } from '../types';

interface PercentCellProps extends BaseCellProps<number> {
  color: string;
}

export const PercentCell: FC<PercentCellProps> = ({ value, color }) => {
  const percent = formatPercent.format(value / 100);

  return <Percent color={color}>{percent}</Percent>;
};
