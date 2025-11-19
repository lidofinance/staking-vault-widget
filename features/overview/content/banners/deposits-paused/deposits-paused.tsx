import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';
import { DepositsPausedDescription } from './deposits-paused-description';

export const DepositsPaused = () => {
  const { values } = useVaultOverview();
  const { beaconChainDepositsPauseIntent } = values ?? {};

  if (!beaconChainDepositsPauseIntent) {
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
