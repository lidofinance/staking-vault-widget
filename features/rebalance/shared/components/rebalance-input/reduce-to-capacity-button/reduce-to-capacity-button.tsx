import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';

import { InputDecoratorMaxButton } from 'shared/components/input-amount/input-decorator-max-button';
import { vaultTexts } from 'modules/vaults';

import { useRebalanceState } from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

export const ReduceToCapacityButton = () => {
  const {
    setValue,
    formState: { disabled },
  } = useFormContext<RebalanceFormFieldValues>();

  const { rebalanceAmount } = useWatch<RebalanceFormFieldValues>();
  const { reduceToCapacityAmount, maxRebalanceAmount, rebalanceMode } =
    useRebalanceState();

  const isCapacityExceeded = rebalanceMode === 'healing';

  const maxButtonValue = isCapacityExceeded
    ? reduceToCapacityAmount
    : maxRebalanceAmount;

  const handleSetMax = useCallback(() => {
    maxButtonValue &&
      setValue('rebalanceAmount', maxButtonValue, {
        shouldValidate: true,
      });
  }, [setValue, maxButtonValue]);

  const isMaxButtonDisabled =
    disabled || !maxButtonValue || rebalanceAmount === maxButtonValue;

  const text = isCapacityExceeded
    ? vaultTexts.actions.rebalance.input.reduceToCapacity
    : 'MAX';

  return (
    <InputDecoratorMaxButton
      disabled={isMaxButtonDisabled}
      onClick={handleSetMax}
      data-testid={isCapacityExceeded ? 'reduceToCapacityBtn' : undefined}
    >
      {text}
    </InputDecoratorMaxButton>
  );
};
