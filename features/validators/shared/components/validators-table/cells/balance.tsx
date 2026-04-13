import type { FC } from 'react';
import { Td, Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

type BalanceCellProps = {
  amount: bigint;
};

export const BalanceCell: FC<BalanceCellProps> = ({ amount }) => {
  return (
    <Td>
      <Text size="xxs">
        <FormatToken amount={amount} maxDecimalDigits={2} />
      </Text>
    </Td>
  );
};
