import type { FC } from 'react';

import { isOverKiloEth } from 'utils';
import { FormatToken } from 'shared/formatters';

import { BigAmount } from './big-amount';

type TierAmountProps = {
  amount: bigint;
};

export const TierLimitAmount: FC<TierAmountProps> = ({ amount }) => {
  return (
    <>
      {isOverKiloEth(amount) ? (
        <BigAmount amount={amount} />
      ) : (
        <FormatToken
          amount={amount}
          maxDecimalDigits={2}
          symbol="stETH"
          data-testid="tierMintingLimit-tierAmount"
        />
      )}
    </>
  );
};
