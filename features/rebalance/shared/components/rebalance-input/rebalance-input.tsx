import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { vaultTexts, useVault } from 'modules/vaults';
import { Eth, Tooltip, Text } from '@lidofinance/lido-ui';

import { TokenAmountInputGroup } from 'shared/hook-form';
import { InfoRowAmount } from 'shared/components/form';
import { isBigint } from 'utils';

import { useRebalanceState } from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { ReduceToCapacityButton } from './reduce-to-capacity-button';

import { Container, TooltipAnchor, InlineLink } from './styles';
import { appPaths } from 'consts/routing';
import { Address } from 'viem';

const {
  available,
  forceRebalanceTooltip,
  rebalanceOversupplyWarning,
  rebalanceOversupplyWarningLink,
  rebalanceRecommendedExplainer,
} = vaultTexts.actions.rebalance.input;

export const RebalanceInput = () => {
  const { vaultAddress } = useVault();
  const {
    setValue,
    formState: { disabled, isLoading: isFormReadyLoading },
  } = useFormContext<RebalanceFormFieldValues>();
  const {
    isForceRebalance,
    valueToForceRebalance,
    maxRebalanceAmount,
    reduceToCapacityAmount,
    rebalanceMode,
    canReduceToCapacity,
    isSupplyEth,
  } = useRebalanceState();

  // In forced rebalance the whole available amount is rebalanced via the hub,
  // so the field is pre-filled and locked from editing.
  useEffect(() => {
    if (
      isForceRebalance &&
      !isFormReadyLoading &&
      isBigint(valueToForceRebalance)
    ) {
      setValue('rebalanceAmount', valueToForceRebalance, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
    }
  }, [isForceRebalance, valueToForceRebalance, isFormReadyLoading, setValue]);

  const input = (
    <TokenAmountInputGroup
      amountFieldName="rebalanceAmount"
      tokenLabel="ETH"
      showRightDecorator={!isForceRebalance}
      leftDecorator={<Eth />}
      rightDecorator={<ReduceToCapacityButton />}
      disabled={disabled || isForceRebalance}
      warning={
        rebalanceMode === 'healing' &&
        isSupplyEth &&
        reduceToCapacityAmount === 0n ? (
          <>
            {rebalanceOversupplyWarning}{' '}
            <InlineLink
              href={appPaths.vaults
                .vault(vaultAddress as Address)
                .eth('supply')}
            >
              {rebalanceOversupplyWarningLink}
            </InlineLink>
          </>
        ) : undefined
      }
    />
  );

  return (
    <Container>
      <InfoRowAmount
        title={available}
        amount={maxRebalanceAmount}
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
      {rebalanceMode === 'healing' && (
        <Text size="xxs" color="secondary">
          {rebalanceRecommendedExplainer(canReduceToCapacity)}
        </Text>
      )}
    </Container>
  );
};
