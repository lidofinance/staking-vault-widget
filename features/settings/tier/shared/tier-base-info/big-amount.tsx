import type { FC } from 'react';
import { Tooltip } from '@lidofinance/lido-ui';

import { formatBalance, formatBigEthAmount } from 'utils';

type BigAmountProps = {
  amount: bigint;
};

export const BigAmount: FC<BigAmountProps> = ({ amount }) => {
  return (
    <Tooltip
      placement="topRight"
      title={<span>{formatBalance(amount).actual} stETH</span>}
    >
      <span>{formatBigEthAmount(amount, 'stETH')}</span>
    </Tooltip>
  );
};
