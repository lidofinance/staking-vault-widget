import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { FormatToken } from 'shared/formatters';

import { ListItem, ListItemContent } from '../styles';

type RepayOrRebalanceProps = {
  amount: bigint | undefined;
};

export const RepayOrRebalance: FC<RepayOrRebalanceProps> = ({ amount }) => {
  if (!amount) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <Text size="xxs">
          Repay <FormatToken amount={amount} symbol="stETH" /> in redemptions or
          perform a rebalance.
          {/* TODO: add Learn more. */}
        </Text>
      </ListItemContent>
    </ListItem>
  );
};
