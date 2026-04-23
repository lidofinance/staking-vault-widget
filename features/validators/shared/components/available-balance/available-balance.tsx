import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { AvailableWrapper } from './styles';

type AvailableBalanceProps = {
  title: string;
  amount: bigint;
};

export const AvailableBalance: FC<AvailableBalanceProps> = ({
  title,
  amount,
}) => {
  return (
    <AvailableWrapper>
      <Text size="xxs" color="secondary">
        {title}
      </Text>
      <Text size="xxs">
        <FormatToken amount={amount} symbol="ETH" />
      </Text>
    </AvailableWrapper>
  );
};
