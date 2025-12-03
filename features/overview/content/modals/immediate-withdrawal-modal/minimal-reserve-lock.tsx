import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { TextContainer } from './styles';

type MinimalReserveLockProps = {
  amount: bigint;
};

export const MinimalReserveLock: FC<MinimalReserveLockProps> = ({ amount }) => {
  return (
    <TextContainer>
      <Text size="xxs" color="secondary">
        Reserve is defined by the Minimal Reserve value of{' '}
        <FormatToken amount={amount} maxDecimalDigits={8} symbol="ETH" /> for
        the connection to Lido Core.
      </Text>
    </TextContainer>
  );
};
