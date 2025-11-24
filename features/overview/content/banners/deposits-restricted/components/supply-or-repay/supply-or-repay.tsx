import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { ListItem, ListItemContent } from '../styles';

type SupplyOrRepayProps = {
  amount: bigint | undefined;
};

export const SupplyOrRepay: FC<SupplyOrRepayProps> = ({ amount }) => {
  if (!amount) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <Text size="xxs">
          Supply ETH, repay stETH, or perform rebalance to restore Health
          Factor.
          {/* TODO: add Learn more. */}
        </Text>
      </ListItemContent>
    </ListItem>
  );
};
