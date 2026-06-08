import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { Eth, Tooltip } from '@lidofinance/lido-ui';

import { TokenAmountInputGroup } from 'shared/hook-form';
import { InfoRowAmount } from 'shared/components/form';
import { isBigint } from 'utils';

import {
  useIsForceRebalance,
  useMaxRebalanceAmount,
} from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { ReduceToCapacityButton } from './reduce-to-capacity-button';

import { Container, TooltipAnchor } from './styles';

const { available, forceRebalanceTooltip } = vaultTexts.actions.rebalance.input;

export const RebalanceInput = () => {
  const {
    setValue,
    formState: { disabled, isLoading: isFormReadyLoading },
  } = useFormContext<RebalanceFormFieldValues>();
  const { data, isPending } = useVaultOverviewData();
  const { rebalanceETH, availableBalanceWei } = data ?? {};
  const isForceRebalance = useIsForceRebalance();
  const maxAmount = useMaxRebalanceAmount();

  // In forced rebalance the whole available amount is rebalanced via the hub,
  // so the field is pre-filled and locked from editing.
  useEffect(() => {
    if (
      isForceRebalance &&
      !isPending &&
      !isFormReadyLoading &&
      isBigint(rebalanceETH)
    ) {
      // TODO: calc amount based on 100% utilization ratio
      setValue('rebalanceAmount', rebalanceETH, {
        shouldValidate: false,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [isForceRebalance, rebalanceETH, isPending, isFormReadyLoading, setValue]);

  const input = (
    <TokenAmountInputGroup
      amountFieldName="rebalanceAmount"
      tokenLabel="ETH"
      maxAmount={maxAmount}
      showRightDecorator={!isForceRebalance}
      leftDecorator={<Eth />}
      rightDecorator={<ReduceToCapacityButton />}
      disabled={disabled || isForceRebalance}
    />
  );

  return (
    <Container>
      <InfoRowAmount
        title={available}
        amount={availableBalanceWei}
        token="ETH"
        disabled={disabled}
        data-testid="availableToRebalanceRow"
      />
      {isForceRebalance ? (
        <Tooltip title={forceRebalanceTooltip} placement="bottomRight">
          <TooltipAnchor>{input}</TooltipAnchor>
        </Tooltip>
      ) : (
        input
      )}
    </Container>
  );
};
