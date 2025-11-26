import type { FC } from 'react';

import { FormatToken } from 'shared/formatters';

import { ListItem, ListItemContent } from '../styles';
import { TextStyled } from '../../../styles';

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
        <TextStyled size="xxs">
          Repay <FormatToken amount={amount} symbol="stETH" /> in redemptions or
          perform a rebalance.
          {/* TODO: add Learn more. */}
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
