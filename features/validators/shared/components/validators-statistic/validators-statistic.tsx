import { type FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { useEthUsd } from 'shared/hooks/use-eth-usd';
import { FormatToken, FormatPrice } from 'shared/formatters';
import { InlineLoader, TooltipHint } from 'shared/components';

import { StatisticContainer, Title } from './styles';

type ValidatorsStatisticProps = {
  title: string;
  hint?: string;
  amount: bigint | undefined;
};

export const ValidatorsStatistic: FC<ValidatorsStatisticProps> = ({
  title,
  amount,
  hint,
}) => {
  const { usdAmount, isLoading } = useEthUsd(amount);

  return (
    <StatisticContainer>
      <Title>
        <Text size="xxs" color="secondary">
          {title}
        </Text>
        {!!hint && <TooltipHint hint={hint} />}
      </Title>
      <InlineLoader
        isLoading={typeof amount !== 'bigint'}
        height={28}
        width={56}
      >
        <Text size="lg" strong>
          <FormatToken amount={amount} maxDecimalDigits={4} symbol="ETH" />
        </Text>
      </InlineLoader>
      <InlineLoader isLoading={isLoading || !usdAmount} height={20} width={80}>
        <Text size="xxs" strong style={{ textTransform: 'uppercase' }}>
          <FormatPrice amount={usdAmount as number} />
        </Text>
      </InlineLoader>
    </StatisticContainer>
  );
};
