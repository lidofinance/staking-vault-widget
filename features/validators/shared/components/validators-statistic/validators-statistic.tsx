import { type FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { FormatToken, FormatPrice } from 'shared/formatters';
import { InlineLoader, TooltipHint } from 'shared/components';
import { isBigint } from 'utils';

import { StatisticContainer, Title } from './styles';

type ValidatorsStatisticProps = {
  title: string;
  hint?: string;
  amount: bigint | undefined;
  hideOnZero?: boolean;
  'data-testid'?: string;
};

export const ValidatorsStatistic: FC<ValidatorsStatisticProps> = ({
  title,
  amount,
  hint,
  hideOnZero = false,
  'data-testid': dataTestId,
}) => {
  const { usdAmount, isLoading } = useEthUsd(amount);
  const formatPriceAmount = amount === 0n ? 0 : usdAmount;
  const maxDecimalDigits = isBigint(amount) && amount > 0n ? 4 : 0;

  if (hideOnZero && isBigint(amount) && amount === 0n) {
    return null;
  }

  return (
    <StatisticContainer data-testid={dataTestId}>
      <InlineLoader
        isLoading={isLoading || !isBigint(amount)}
        height={18}
        width={100}
      >
        <Title>
          <Text size="xxs" color="secondary">
            {title}
          </Text>
          {!!hint && <TooltipHint hint={hint} />}
        </Title>
      </InlineLoader>
      <InlineLoader isLoading={!isBigint(amount)} height={28} width={56}>
        <Text size="lg" strong data-testid="eth-balance">
          <FormatToken
            amount={amount}
            maxDecimalDigits={maxDecimalDigits}
            symbol="ETH"
          />
        </Text>
      </InlineLoader>
      <InlineLoader
        isLoading={isLoading || !isBigint(amount)}
        height={20}
        width={80}
      >
        <Text
          size="xxs"
          strong
          style={{ textTransform: 'uppercase' }}
          data-testid="usd-balance"
        >
          <FormatPrice amount={formatPriceAmount} />
        </Text>
      </InlineLoader>
    </StatisticContainer>
  );
};
