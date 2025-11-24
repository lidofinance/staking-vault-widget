import { WEI_PER_ETHER } from 'consts/tx';

import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';
import {
  HowToResolve,
  RepayOrRebalance,
  ApplyReport,
  SupplyOrRepay,
  EnableDeposits,
} from './components';

export const DepositsRestricted = () => {
  const { values } = useVaultOverview();
  const {
    stETHToBurn,
    feesToSettle,
    redemptionStETH,
    beaconChainDepositsPauseIntent,
  } = values ?? {};

  if (typeof feesToSettle !== 'bigint' || feesToSettle < WEI_PER_ETHER) {
    return null;
  }

  return (
    <NoticeContainer
      title="Deposits from stVault Balance to validators are temporarily restricted"
      description="Node Operator cannot deposit ETH from the stVault Balance to validators. Сonsolidations remain allowed. The Vault Owner has paused deposits from stVault Balance to validators, and the restriction is currently enforced by Lido Core."
    >
      <HowToResolve>
        <ApplyReport lidoFees={feesToSettle} />
        <SupplyOrRepay amount={stETHToBurn} />
        <RepayOrRebalance amount={redemptionStETH} />
        <EnableDeposits isPaused={beaconChainDepositsPauseIntent} />
      </HowToResolve>
    </NoticeContainer>
  );
};
