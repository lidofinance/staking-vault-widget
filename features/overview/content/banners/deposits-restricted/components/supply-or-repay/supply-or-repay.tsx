import type { FC } from 'react';

import { ListItem, ListItemContent } from '../styles';
import { TextStyled } from '../../../styles';

type SupplyOrRepayProps = {
  isNotHealth: boolean | undefined;
};

export const SupplyOrRepay: FC<SupplyOrRepayProps> = ({ isNotHealth }) => {
  if (!isNotHealth) {
    return null;
  }

  return (
    <ListItem>
      <ListItemContent>
        <TextStyled size="xxs">
          Supply ETH, repay stETH, or perform rebalance to restore Health
          Factor.
          {/* TODO: add Learn more. */}
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
