import type { FC } from 'react';

import { NoticeContainer } from 'features/overview/shared';
import type { VaultQuarantineState } from 'features/overview/hooks';
import { QuarantineDescription } from './quarantine-description';

type CapitalQuarantinedProps = {
  vaultQuarantineState: VaultQuarantineState | undefined;
};

export const CapitalQuarantined: FC<CapitalQuarantinedProps> = ({
  vaultQuarantineState,
}) => {
  const { endTimestamp, pendingTotalValueIncrease, totalValueRemainder } =
    vaultQuarantineState ?? {};

  if (
    !endTimestamp ||
    !pendingTotalValueIncrease ||
    typeof totalValueRemainder !== 'bigint'
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      type="info"
      description={
        <QuarantineDescription
          pendingTotalValueIncrease={pendingTotalValueIncrease}
          totalValueRemainder={totalValueRemainder}
          timestamp={endTimestamp}
        />
      }
    />
  );
};
