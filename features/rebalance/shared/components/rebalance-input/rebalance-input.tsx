import { useEffect } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { Eth } from '@lidofinance/lido-ui';

import { TokenAmountInputGroup } from 'shared/hook-form';
import { InfoRowAmount } from 'shared/components/form';
import { isBigint } from 'utils';

import {
  useIsForceRebalance,
  useRebalanceMode,
} from 'features/rebalance/hooks';
import { getMaxRebalanceAmount } from 'features/rebalance/shared/get-rebalance-mode';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { Container } from './styles';

export const RebalanceInput = () => {
  const {
    setValue,
    formState: { disabled },
  } = useFormContext<RebalanceFormFieldValues>();
  const { data } = useVaultOverviewData();
  const { rebalanceETH, balance, vaultLiability } = data ?? {};
  const isForceRebalance = useIsForceRebalance();
  const mode = useRebalanceMode();

  const [supplyEth, isSupplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['supplyEth', 'isSupplyEth']
  >({ name: ['supplyEth', 'isSupplyEth'] });

  // In forced rebalance the whole available amount is rebalanced via the hub,
  // so the field is pre-filled and locked from editing.
  useEffect(() => {
    if (isForceRebalance && isBigint(rebalanceETH)) {
      setValue('rebalanceAmount', rebalanceETH, { shouldValidate: true });
    }
  }, [isForceRebalance, rebalanceETH, setValue]);

  // The "Max" helper mirrors the validation cap: in the capacity-exceeded case
  // the repayment is bounded by the idle balance plus supplied ETH and by the
  // outstanding liability.
  const maxAmount = getMaxRebalanceAmount({
    mode,
    rebalanceETH: rebalanceETH ?? 0n,
    balance: balance ?? 0n,
    vaultLiability: vaultLiability ?? 0n,
    supplyEth: isSupplyEth ? supplyEth ?? 0n : 0n,
  });

  return (
    <Container>
      <InfoRowAmount
        title={vaultTexts.actions.rebalance.input.available}
        amount={balance}
        token="ETH"
        disabled={disabled}
        data-testid="availableToRebalanceRow"
      />
      <TokenAmountInputGroup
        amountFieldName="rebalanceAmount"
        tokenLabel="ETH"
        maxAmount={maxAmount}
        showRightDecorator={!isForceRebalance}
        leftDecorator={<Eth />}
        disabled={disabled || isForceRebalance}
      />
    </Container>
  );
};
