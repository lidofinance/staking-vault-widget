import type { FC, PropsWithChildren } from 'react';
import { Text, Tooltip } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';
import { isBigint, useFormattedBalance } from 'utils';

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
  const isPayable = isBigint(amount) && !!symbol;
  const { actual } = useFormattedBalance(amount);
  const tooltipTitle = `${actual} ${symbol}`;

  const content = (
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
        <>
          {children}
          {isPayable && (
            <>
              {' '}
              <FormatToken
                amount={amount}
                symbol={symbol}
                maxDecimalDigits={4}
              />
            </>
          )}
        </>
      </ActionButton>
    </ActionWrapper>
  );

  return (
    <>
      {isPayable ? <Tooltip title={tooltipTitle}>{content}</Tooltip> : content}
    </>
  );
};
