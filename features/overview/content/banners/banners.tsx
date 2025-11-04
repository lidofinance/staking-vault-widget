import { useMemo } from 'react';

import { useVaultOverviewData } from 'features/overview/hooks';
import { DisconnectState } from './disconnect-state';
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
  const {
    endTimestamp,
    pendingTotalValueIncrease,
    isActive: isQuarantineActive,
  } = vaultQuarantineState ?? {};

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
      <DisconnectState
        isPendingDisconnect={isPendingDisconnect}
        isVaultDisconnected={isVaultDisconnected}
      />
      {beaconChainDepositsPauseIntent && <DepositsPaused />}
      {isQuarantineActive && (
        <CapitalQuarantined
          endTimestamp={endTimestamp}
          pendingTotalValueIncrease={pendingTotalValueIncrease}
        />
      )}
    </BannerContainer>
  );
};
