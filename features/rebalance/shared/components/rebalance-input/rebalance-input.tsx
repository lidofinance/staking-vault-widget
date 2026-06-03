import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { Eth } from '@lidofinance/lido-ui';

import { TokenAmountInputGroup } from 'shared/hook-form';
import { InfoRowAmount } from 'shared/components/form';

import { useIsForceRebalance } from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { Container } from './styles';

export const RebalanceInput = () => {
  const {
    setValue,
    formState: { disabled },
  } = useFormContext<RebalanceFormFieldValues>();
  const { data } = useVaultOverviewData();
  const { rebalanceETH } = data ?? {};
  const isForceRebalance = useIsForceRebalance();

  // In forced rebalance the whole available amount is rebalanced via the hub,
  // so the field is pre-filled and locked from editing.
  useEffect(() => {
    if (isForceRebalance && rebalanceETH != null) {
      setValue('rebalanceAmount', rebalanceETH, { shouldValidate: true });
    }
  }, [isForceRebalance, rebalanceETH, setValue]);

  return (
    <Container>
      <InfoRowAmount
        title={vaultTexts.actions.rebalance.input.available}
        amount={rebalanceETH}
        token="ETH"
        disabled={disabled}
        data-testid="availableToRebalanceRow"
      />
      <TokenAmountInputGroup
        amountFieldName="rebalanceAmount"
        tokenLabel="ETH"
        maxAmount={rebalanceETH}
        showRightDecorator={!isForceRebalance}
        leftDecorator={<Eth />}
        disabled={disabled || isForceRebalance}
      />
    </Container>
  );
};
