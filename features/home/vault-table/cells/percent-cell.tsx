import type { FC } from 'react';
import { formatToPercentWithDivider } from 'utils';

import { Percent } from './styles';
import { EMPTY_DATA } from 'consts/text';

type PercentCellProps = {
  value?: number;
  color?: string;
  strong?: boolean;
};

export const PercentCell: FC<PercentCellProps> = ({ value, color, strong }) => {
  if (typeof value !== 'number') {
    return EMPTY_DATA;
  }

  return (
    <Percent color={color} strong={strong}>
      {formatToPercentWithDivider(value)}
    </Percent>
  );
};
