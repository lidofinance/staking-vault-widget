import { useMemo } from 'react';

import { useCheckAvailability } from '../../../hooks';
import { PreparationItem } from '../preparation-item';
import { ErrorFetching } from '../error-fetching';
import { BalanceCoverFees } from './balance-cover-fees';
import { SupplyForFees } from './supply-for-fees';

export const UnsettledFees = () => {
  const { isLoading, isError, isNeedSupplyForFees, supplyBalanceForFees } =
    useCheckAvailability();
  const canShowContent = !isLoading && !isError;

  const status = useMemo(() => {
    if (isLoading) {
      return 'loading';
    }
    if (isError || isNeedSupplyForFees) {
      return 'error';
    }

    return 'success';
  }, [isLoading, isError, isNeedSupplyForFees]);

  return (
    <PreparationItem status={status}>
      {canShowContent && !isNeedSupplyForFees && <BalanceCoverFees />}
      {canShowContent && isNeedSupplyForFees && (
        <SupplyForFees diff={supplyBalanceForFees} />
      )}
      {isError && <ErrorFetching />}
    </PreparationItem>
  );
};
