import type { FC } from 'react';
import { formatPercent } from 'utils/format-number';

import { Percent } from './styles';

type PercentCellProps = {
  value: number;
  color: string;
};

export const PercentCell: FC<PercentCellProps> = ({ value, color }) => {
  const percent = formatPercent.format(value / 100);

  return <Percent color={color}>{percent}</Percent>;
};
