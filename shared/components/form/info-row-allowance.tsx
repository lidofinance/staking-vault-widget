import { ReactNode, useMemo } from 'react';
import { maxUint256 } from 'viem';
import { DataTableRow } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import {
  getTokenDisplayName,
  TOKEN_DISPLAY_NAMES,
} from 'utils/getTokenDisplayName';
import { DataTableRowStyled } from './styles';

export type InfoRowAllowanceProps = Omit<
  React.ComponentProps<typeof DataTableRow>,
  'title'
> & {
  title?: ReactNode;
  token: TOKEN_DISPLAY_NAMES;
  allowance?: bigint;
  loading?: boolean;
  isBlank?: boolean;
};

export const InfoRowAllowance = ({
  token,
  allowance,
  isBlank,
  title = 'Allowance',
  ...rest
}: InfoRowAllowanceProps) => {
  const isInfiniteAllowance = useMemo(() => {
    return allowance === maxUint256;
  }, [allowance]);
  return (
    <DataTableRowStyled title={title} {...rest}>
      {isBlank || allowance == null ? (
        '-'
      ) : isInfiniteAllowance ? (
        'Infinite'
      ) : (
        <FormatToken
          amount={allowance || 0n}
          symbol={getTokenDisplayName(token)}
        />
      )}
    </DataTableRowStyled>
  );
};
