import { ComponentProps } from 'react';

import { FormatToken } from 'shared/formatters';
import { DATA_UNAVAILABLE } from 'consts/text';

import { DataTableRowStyled } from './styles';

type InfoRowAmountProps = {
  amount?: bigint | null;
  token?: string;
  noDataLabel?: string;
} & ComponentProps<typeof DataTableRowStyled>;

export const InfoRowAmount = ({
  amount,
  token,
  noDataLabel = DATA_UNAVAILABLE,
  ...props
}: InfoRowAmountProps) => {
  return (
    <DataTableRowStyled {...props}>
      <FormatToken amount={amount} symbol={token} fallback={noDataLabel} />
    </DataTableRowStyled>
  );
};
