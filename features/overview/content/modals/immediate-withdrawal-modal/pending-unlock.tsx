import type { FC } from 'react';

import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { TextContainer } from './styles';

type PendingUnlockProps = {
  amount: bigint;
};

export const PendingUnlock: FC<PendingUnlockProps> = ({ amount }) => {
  return (
    <TextContainer>
      <Text size="xxs" color="secondary">
        Corresponding amount of ETH expecting to be unlocked with the upcoming
        Oracle report based on recently repaid
      </Text>{' '}
      <Text size="xxs" color="secondary" strong>
        ~
        <FormatToken amount={amount} maxDecimalDigits={8} symbol="stETH" />.
      </Text>
    </TextContainer>
  );
};
