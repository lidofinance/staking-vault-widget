import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import { InputDecoratorMaxButton } from 'shared/components/input-amount/input-decorator-max-button';
import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { isNumber } from 'utils';
import { UTILIZATION_RATIO_THRESHOLD } from 'consts/threshold';

import {
  useIsForceRebalance,
  useMaxRebalanceAmount,
  useReduceToCapacityAmount,
} from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import { ReduceButton } from './styles';

export const ReduceToCapacityButton = () => {
  const {
    setValue,
    formState: { disabled },
  } = useFormContext<RebalanceFormFieldValues>();
  const { data } = useVaultOverviewData();
  const { utilizationRatioNumber } = data ?? {};
  const isForceRebalance = useIsForceRebalance();
  const reduceToCapacityAmount = useReduceToCapacityAmount();
  const maxRebalanceAmount = useMaxRebalanceAmount();

  const isCapacityExceeded =
    !isForceRebalance &&
    isNumber(utilizationRatioNumber) &&
    utilizationRatioNumber >= UTILIZATION_RATIO_THRESHOLD &&
    reduceToCapacityAmount > 0n;

  const handleReduceToCapacity = useCallback(() => {
    setValue('rebalanceAmount', reduceToCapacityAmount, {
      shouldValidate: true,
    });
  }, [setValue, reduceToCapacityAmount]);

  const handleSetMax = useCallback(() => {
    setValue('rebalanceAmount', maxRebalanceAmount, {
      shouldValidate: true,
    });
  }, [setValue, maxRebalanceAmount]);

  if (!isCapacityExceeded) {
    return (
      <InputDecoratorMaxButton onClick={handleSetMax} disabled={disabled} />
    );
  }

  return (
    <ReduceButton
      size="xxs"
      variant="translucent"
      disabled={disabled}
      onClick={handleReduceToCapacity}
      data-testid="reduceToCapacityBtn"
    >
      {vaultTexts.actions.rebalance.input.reduceToCapacity}
    </ReduceButton>
  );
};
