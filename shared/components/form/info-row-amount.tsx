import { ComponentProps } from 'react';

import { FormatToken } from 'shared/formatters';
import { EMPTY_DATA } from 'consts/text';

import { DataTableRowStyled } from './styles';

type InfoRowAmountProps = {
  amount?: bigint | null;
  token?: string;
  noDataLabel?: string;
  disabled?: boolean;
} & ComponentProps<typeof DataTableRowStyled>;

export const InfoRowAmount = ({
  amount,
  token,
  noDataLabel = EMPTY_DATA,
  ...props
}: InfoRowAmountProps) => {
  return (
    <DataTableRowStyled {...props}>
      <FormatToken
        data-testid="rowValue"
        amount={amount}
        symbol={token}
        fallback={noDataLabel}
      />
    </DataTableRowStyled>
  );
};
