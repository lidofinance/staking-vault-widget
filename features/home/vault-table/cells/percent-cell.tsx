import type { FC } from 'react';
import { formatPercent } from 'utils';

import { Percent } from './styles';
import { DATA_UNAVAILABLE } from 'consts/text';

type PercentCellProps = {
  value?: number;
  color?: string;
  strong?: boolean;
};

export const PercentCell: FC<PercentCellProps> = ({ value, color, strong }) => {
  if (typeof value !== 'number') {
    return DATA_UNAVAILABLE;
  }

  return (
    <Percent color={color} strong={strong}>
      {formatPercent.format(value / 100)}
    </Percent>
  );
};
