import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { TdStyled } from './styles';

type BalanceCellProps = {
  amount: bigint;
};

export const BalanceCell: FC<BalanceCellProps> = ({ amount }) => {
  return (
    <TdStyled>
      <Text size="xxs">
        <FormatToken amount={amount} maxDecimalDigits={2} />
      </Text>
    </TdStyled>
  );
};
