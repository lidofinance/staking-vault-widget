import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults';
import { ONE_ETHER } from 'consts/tx';

import { WarningInfo } from 'features/validators/shared';

type LowBalanceProps = {
  availableBalance: bigint;
};

const { availableBalanceLow } = vaultTexts.actions.validators.modals.topUp;

export const LowBalance: FC<LowBalanceProps> = ({ availableBalance }) => {
  if (availableBalance >= ONE_ETHER) {
    return null;
  }

  return (
    <WarningInfo data-testid="low-balance-warn">
      {availableBalanceLow(availableBalance)}
    </WarningInfo>
  );
};
