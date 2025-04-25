import { FC } from 'react';

import { formatBalance } from 'utils';
import { BaseCellProps } from 'features/home/components/vault-table/types';

export const EtherCell: FC<BaseCellProps<bigint>> = ({ value }) => {
  return (
    <>
      {
        formatBalance(value, { maxDecimalDigits: 3, trimEllipsis: true })
          .trimmed
      }
    </>
  );
};
