import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults';
import { WEI_PER_ETHER } from 'consts/tx';

import { WarningInfo } from 'features/validators/shared';

type LowBalanceProps = {
  availableBalance: bigint;
};

const { availableBalanceLow } = vaultTexts.actions.validators.modals.topUp;

export const LowBalance: FC<LowBalanceProps> = ({ availableBalance }) => {
  if (availableBalance >= WEI_PER_ETHER) {
    return null;
  }

  return <WarningInfo>{availableBalanceLow(availableBalance)}</WarningInfo>;
};
