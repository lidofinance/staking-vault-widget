import { ONE_ETHER } from 'consts/tx';
import { isBigint } from 'utils';

import { NoticeContainer } from 'features/overview/shared';
import { useVaultOverview } from 'features/overview/vault-overview';
import {
  HowToResolve,
  RepayOrRebalance,
  SettleFees,
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

  if (
    !healthFactorNumber ||
    ((!isBigint(feesToSettle) || feesToSettle < ONE_ETHER) &&
      (!isBigint(redemptionStETH) || redemptionStETH === 0n)) ||
    !beaconChainDepositsPaused
  ) {
    return null;
  }

  const isNotHealth = healthFactorNumber < 100;

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
          <SettleFees lidoFees={feesToSettle} />
          <SupplyOrRepay isNotHealth={isNotHealth} />
          <RepayOrRebalance amount={redemptionStETH} />
          <EnableDeposits isPausedByUser={beaconChainDepositsPauseIntent} />
        </HowToResolve>
      </div>
    </NoticeContainer>
  );
};
