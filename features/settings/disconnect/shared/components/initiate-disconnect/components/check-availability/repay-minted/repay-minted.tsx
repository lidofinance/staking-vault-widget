import { useMemo } from 'react';

import { useCheckAvailability } from '../../../hooks';
import { PreparationItem } from '../preparation-item';
import { ErrorFetching } from '../error-fetching';
import { RepayLiability } from './repay-liability';
import { LiabilityRepayed } from './liability-repayed';

export const RepayMinted = () => {
  const { vaultLiabilityStETH, isLoading, isError, hasMintedStETH } =
    useCheckAvailability();
  const canShowContent = !isLoading && !isError;
  const status = useMemo(() => {
    if (isLoading) {
      return 'loading';
    }
    if (isError || hasMintedStETH) {
      return 'error';
    }

    return 'success';
  }, [isLoading, isError, hasMintedStETH]);

  return (
    <PreparationItem status={status} dataTestId="requirement-liability">
      {canShowContent && hasMintedStETH && (
        <RepayLiability liability={vaultLiabilityStETH} />
      )}
      {canShowContent && !hasMintedStETH && <LiabilityRepayed />}
      {isError && <ErrorFetching />}
    </PreparationItem>
  );
};
