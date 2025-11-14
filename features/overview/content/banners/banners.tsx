import { useMemo } from 'react';

import { useVaultOverviewData } from 'features/overview/hooks';
import { PendingDisconnect } from './pending-disconnect';
import { DepositsPaused } from './deposits-paused';
import { CapitalQuarantined } from './capital-quarantined';

import { BannerContainer } from './styles';

export const Banners = () => {
  const { data } = useVaultOverviewData();

  const {
    isVaultDisconnected,
    isPendingDisconnect,
    beaconChainDepositsPauseIntent,
    vaultQuarantineState,
  } = data ?? {};
  const { isActive: isQuarantineActive } = vaultQuarantineState ?? {};

  const showBanners = useMemo(
    () =>
      [
        isVaultDisconnected,
        isPendingDisconnect,
        beaconChainDepositsPauseIntent,
        isQuarantineActive,
      ].some((flag) => !!flag),
    [
      isVaultDisconnected,
      isPendingDisconnect,
      beaconChainDepositsPauseIntent,
      isQuarantineActive,
    ],
  );

  if (!showBanners) {
    return null;
  }

  return (
    <BannerContainer>
      <PendingDisconnect isPendingDisconnect={isPendingDisconnect} />
      {beaconChainDepositsPauseIntent && <DepositsPaused />}
      {isQuarantineActive && (
        <CapitalQuarantined vaultQuarantineState={vaultQuarantineState} />
      )}
    </BannerContainer>
  );
};
