import type { FC, PropsWithChildren } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { isBigint } from 'utils';

import { ActionButton, ActionWrapper } from './styles';

type ActionProps = {
  title: string;
  amount?: bigint;
  symbol?: string;
  onClick: () => void;
};

export const Action: FC<PropsWithChildren<ActionProps>> = ({
  title,
  amount,
  symbol,
  onClick,
  children,
}) => {
  return (
    <ActionWrapper>
      <Text size="xxs" strong>
        {title}
      </Text>
      <ActionButton
        onClick={onClick}
        size="xs"
        variant="outlined"
        color="secondary"
      >
        {children}
        {isBigint(amount) && symbol && (
          <>
            {' '}
            <FormatToken amount={amount} symbol={symbol} maxDecimalDigits={4} />
          </>
        )}
      </ActionButton>
    </ActionWrapper>
  );
};
