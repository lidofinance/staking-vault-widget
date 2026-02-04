import type { FC } from 'react';

import { HEALTH_EMERGENCY_GUIDE_LINK } from 'features/overview/consts';

import { LearnMore } from '../learn-more';
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
          Factor. <LearnMore link={HEALTH_EMERGENCY_GUIDE_LINK} />
        </TextStyled>
      </ListItemContent>
    </ListItem>
  );
};
