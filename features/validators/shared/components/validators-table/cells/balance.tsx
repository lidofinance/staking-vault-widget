import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { TdStyled } from './styles';

type BalanceCellProps = {
  amount: bigint;
  testId?: string;
};

export const BalanceCell: FC<BalanceCellProps> = ({
  amount,
  testId = 'balance',
}) => {
  return (
    <TdStyled data-testid={testId}>
      <Text size="xxs">
        <FormatToken
          amount={amount}
          maxDecimalDigits={4}
          zeroDecimalsIfZeroAmount
        />
      </Text>
    </TdStyled>
  );
};
