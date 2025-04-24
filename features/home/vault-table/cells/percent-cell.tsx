import { FC } from 'react';

import { Percent } from './styles';

import { formatPercent } from 'utils/format-number';
import { BaseCellProps } from '../types';
import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';

export const PercentCell: FC<BaseCellProps<number>> = ({ value }) => {
  const valuePercent = value / VAULT_TOTAL_BASIS_POINTS;
  const percent = formatPercent.format(valuePercent);

  return <Percent value={value}>{percent}</Percent>;
};
