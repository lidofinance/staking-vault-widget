import type { FC } from 'react';

import { NoticeContainer } from 'features/overview/shared';
import { QuarantineDescription } from './quarantine-description';

type CapitalQuarantinedProps = {
  endTimestamp: bigint | undefined;
  pendingTotalValueIncrease: bigint | undefined;
};

export const CapitalQuarantined: FC<CapitalQuarantinedProps> = (props) => {
  const { endTimestamp, pendingTotalValueIncrease } = props;

  if (!endTimestamp || !pendingTotalValueIncrease) {
    return null;
  }

  return (
    <NoticeContainer
      title="Part of the capital is quarantined"
      type="info"
      description={
        <QuarantineDescription
          amount={pendingTotalValueIncrease}
          timestamp={endTimestamp}
        />
      }
    />
  );
};
