import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { ReactComponent as WarningTriangle } from 'assets/icons/warning-triangle.svg';

import { IconWrapper, SlashingInfoWrapper } from './styles';

type SlashingInfoProps = {
  amount: bigint;
};

export const SlashingInfo: FC<SlashingInfoProps> = ({ amount }) => {
  return (
    <SlashingInfoWrapper>
      <IconWrapper>
        <WarningTriangle color="var(--text-color-text-secondary)" />
      </IconWrapper>
      <Text size="xxs" color="secondary">
        Reserve is now defined by the Minimal Reserve value which increased to{' '}
        <FormatToken amount={amount} maxDecimalDigits={4} symbol="ETH" /> as a
        reaction to the slashing event.
      </Text>
    </SlashingInfoWrapper>
  );
};
