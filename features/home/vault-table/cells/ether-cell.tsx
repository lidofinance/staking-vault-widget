import { FC } from 'react';

import { formatBalance } from 'utils';
import { BaseCellProps } from 'features/home/vault-table/types';

export const EtherCell: FC<BaseCellProps<bigint>> = ({ value }) => {
  return <>{formatBalance(value, { maxDecimalDigits: 5 }).trimmed}</>;
};
