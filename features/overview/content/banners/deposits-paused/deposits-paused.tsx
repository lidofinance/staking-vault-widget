import { WEI_PER_ETHER } from 'consts/tx';
import { isBigint } from 'utils';

import { NoticeContainer } from 'features/overview/shared';
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
  const isNotHealth = (healthFactorNumber ?? 100) < 100;

  if (
    !beaconChainDepositsPauseIntent ||
    isNotHealth ||
    (isBigint(feesToSettle) && feesToSettle >= WEI_PER_ETHER) ||
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
