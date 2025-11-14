import { NoticeContainer } from 'features/overview/shared';
import { DepositsPausedDescription } from './deposits-paused-description';

export const DepositsPaused = () => {
  return (
    <NoticeContainer
      title="Deposits from stVault Balance to validators are on pause"
      type="info"
      description={<DepositsPausedDescription />}
    />
  );
};
