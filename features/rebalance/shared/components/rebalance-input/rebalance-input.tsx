import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { Eth } from '@lidofinance/lido-ui';

import { TokenAmountInputGroup } from 'shared/hook-form';
import { InfoRowAmount } from 'shared/components/form';
import { isBigint } from 'utils';

import {
  useIsForceRebalance,
  useMaxRebalanceAmount,
} from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { ReduceToCapacityButton } from './reduce-to-capacity-button';

import { Container } from './styles';

const { available } = vaultTexts.actions.rebalance.input;

export const RebalanceInput = () => {
  const {
    setValue,
    formState: { disabled },
  } = useFormContext<RebalanceFormFieldValues>();
  const { data } = useVaultOverviewData();
  const { rebalanceETH, balance } = data ?? {};
  const isForceRebalance = useIsForceRebalance();
  const maxAmount = useMaxRebalanceAmount();

  // In forced rebalance the whole available amount is rebalanced via the hub,
  // so the field is pre-filled and locked from editing.
  useEffect(() => {
    if (isForceRebalance && isBigint(rebalanceETH)) {
      setValue('rebalanceAmount', rebalanceETH, { shouldValidate: true });
    }
  }, [isForceRebalance, rebalanceETH, setValue]);

  return (
    <Container>
      <InfoRowAmount
        title={available}
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
        rightDecorator={<ReduceToCapacityButton />}
        disabled={disabled || isForceRebalance}
      />
    </Container>
  );
};
