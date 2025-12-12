import { VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';

import { formatPercent } from './format-number';

export const formatBasisPoint = (value: number | undefined): string => {
  if (typeof value === 'undefined') {
    return '';
  }

  return formatPercent.format(value / VAULT_TOTAL_BASIS_POINTS);
};
