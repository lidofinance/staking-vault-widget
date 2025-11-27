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
import { TextStyled } from '../styles';

export const DepositsRestricted = () => {
  const { values } = useVaultOverview();
  const {
    feesToSettle,
    redemptionStETH,
    beaconChainDepositsPauseIntent,
    beaconChainDepositsPaused,
    healthFactorNumber,
  } = values ?? {};
  const isNotHealth = (healthFactorNumber ?? 100) < 100;

  if (
    ((typeof feesToSettle !== 'bigint' || feesToSettle < WEI_PER_ETHER) &&
      (typeof redemptionStETH !== 'bigint' || redemptionStETH === 0n)) ||
    !beaconChainDepositsPaused
  ) {
    return null;
  }

  return (
    <NoticeContainer title="Deposits from stVault Balance to validators are temporarily restricted">
      <div>
        <TextStyled size="xxs">
          Node Operator cannot deposit ETH from the stVault Balance to
          validators. Сonsolidations remain allowed.
        </TextStyled>
        {beaconChainDepositsPauseIntent && (
          <TextStyled size="xxs">
            The Vault Owner has paused deposits from stVault Balance to
            validators, and the restriction is currently enforced by Lido Core.
          </TextStyled>
        )}
        <HowToResolve>
          <ApplyReport lidoFees={feesToSettle} />
          <SupplyOrRepay isNotHealth={isNotHealth} />
          <RepayOrRebalance amount={redemptionStETH} />
          <EnableDeposits isPausedByUser={beaconChainDepositsPauseIntent} />
        </HowToResolve>
      </div>
    </NoticeContainer>
  );
};
