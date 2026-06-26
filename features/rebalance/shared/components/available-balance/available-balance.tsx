import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { AvailableWrapper } from './styles';

type AvailableBalanceProps = {
  title: string;
  amount: bigint;
  'data-testid'?: string;
};

export const AvailableBalance: FC<AvailableBalanceProps> = ({
  title,
  amount,
  'data-testid': dataTestId,
}) => {
  return (
    <AvailableWrapper data-testid={dataTestId}>
      <Text size="xxs" color="secondary">
        {title}
      </Text>
      <Text size="xxs">
        <FormatToken amount={amount} symbol="ETH" />
      </Text>
    </AvailableWrapper>
  );
};
