import { useMemo } from 'react';

import { useValidatorsBalance } from '../../../hooks';
import { PreparationItem } from '../preparation-item';
import { ErrorFetching } from '../error-fetching';
import { ValidatorsExited } from './validators-exited';
import { ExitValidators } from './exit-validators';

export const ManageValidators = () => {
  const {
    isLoading,
    isError,
    timestamp = Date.now(),
    hasValidatorsBalance,
  } = useValidatorsBalance();
  const canShowContent = !isLoading && !isError;

  const status = useMemo(() => {
    if (isLoading) {
      return 'loading';
    }
    if (isError) {
      return 'error';
    }

    if (hasValidatorsBalance) {
      return 'warning';
    }

    return 'success';
  }, [isLoading, isError, hasValidatorsBalance]);

  return (
    <PreparationItem status={status}>
      {canShowContent && hasValidatorsBalance && (
        <ExitValidators timestamp={timestamp} />
      )}
      {canShowContent && !hasValidatorsBalance && <ValidatorsExited />}
      {isError && <ErrorFetching />}
    </PreparationItem>
  );
};
