import { useVaultOverviewData } from 'features/overview/hooks';
import { DisconnectState } from './disconnect-state';
import { DepositsPaused } from './deposits-paused';
import { CapitalQuarantined } from './capital-quarantined';

import { BannerContainer } from './styles';

export const Banners = () => {
  const { data } = useVaultOverviewData();

  const { isVaultDisconnected, isPendingDisconnect } = data ?? {};

  const showBanners = isVaultDisconnected || isPendingDisconnect;
  if (!showBanners) {
    return null;
  }

  return (
    <BannerContainer>
      <DisconnectState
        isPendingDisconnect={isPendingDisconnect}
        isVaultDisconnected={isVaultDisconnected}
      />
      <DepositsPaused />
      <CapitalQuarantined />
    </BannerContainer>
  );
};
