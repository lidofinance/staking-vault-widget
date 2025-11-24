import { WEI_PER_ETHER } from 'consts/tx';

import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';
import { DepositsPausedDescription } from './deposits-paused-description';

export const DepositsPaused = () => {
  const { values } = useVaultOverview();
  const { beaconChainDepositsPauseIntent, feesToSettle, redemptionStETH } =
    values ?? {};

  if (
    !beaconChainDepositsPauseIntent ||
    (typeof feesToSettle === 'bigint' && feesToSettle >= WEI_PER_ETHER) ||
    (typeof redemptionStETH === 'bigint' && redemptionStETH > 0n)
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title="Deposits from stVault Balance to validators are on pause"
      type="info"
      description={<DepositsPausedDescription />}
    />
  );
};
