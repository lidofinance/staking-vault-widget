import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverviewData } from 'features/overview/hooks';
import { DepositsPausedDescription } from './deposits-paused-description';

export const DepositsPaused = () => {
  const { data } = useVaultOverviewData();

  if (!data?.isBeaconDepositsManuallyPaused) {
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
