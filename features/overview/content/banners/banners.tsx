import { PendingDisconnect } from './pending-disconnect';
import { DepositsPaused } from './deposits-paused';
import { CapitalQuarantined } from './capital-quarantined';
import { CapacityExceeded } from './capacity-exceeded';
import { ThresholdExceeded } from './threshold-exceeded';
import { DepositsRestricted } from './deposits-restricted';

import { BannerContainer } from './styles';

export const Banners = () => {
  return (
    <BannerContainer>
      <PendingDisconnect />
      <DepositsPaused />
      <CapitalQuarantined />
      <CapacityExceeded />
      <ThresholdExceeded />
      <DepositsRestricted />
    </BannerContainer>
  );
};
