import type { FC } from 'react';

import { vaultTexts } from 'modules/vaults';

import { WarningInfo } from 'features/validators/shared';

type DepositPausedProps = {
  beaconChainDepositsPaused: boolean;
};

const { depositPaused } = vaultTexts.actions.validators.modals.topUp;

export const DepositPaused: FC<DepositPausedProps> = ({
  beaconChainDepositsPaused,
}) => {
  if (!beaconChainDepositsPaused) {
    return null;
  }

  return <WarningInfo>{depositPaused}</WarningInfo>;
};
