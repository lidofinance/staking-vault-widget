import { ONE_ETHER } from 'consts/tx';
import { isBigint } from 'utils';
import { NoticeContainer } from 'shared/components';

import { useVaultOverview } from 'features/overview/vault-overview';
import { DepositsPausedDescription } from './deposits-paused-description';

export const DepositsPaused = () => {
  const { values } = useVaultOverview();
  const {
    beaconChainDepositsPauseIntent,
    feesToSettle,
    redemptionStETH,
    healthFactorNumber,
  } = values ?? {};

  if (
    !beaconChainDepositsPauseIntent ||
    !healthFactorNumber ||
    healthFactorNumber < 100 ||
    (isBigint(feesToSettle) && feesToSettle >= ONE_ETHER) ||
    (isBigint(redemptionStETH) && redemptionStETH > 0n)
  ) {
    return null;
  }

  return (
    <NoticeContainer
      title="The Vault Owner has paused deposits from stVault Balance to validators"
      type="info"
      description={<DepositsPausedDescription />}
    />
  );
};
