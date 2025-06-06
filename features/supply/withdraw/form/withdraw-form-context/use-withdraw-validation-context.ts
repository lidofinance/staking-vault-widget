import { useCallback, useMemo } from 'react';

import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useVaultInfo } from 'modules/vaults';

import { useWithdrawable } from '../hooks';

import type { WithdrawFormValidationContext } from '../types';

export const useWithdrawValidationContext = () => {
  const { refetchVaultInfo } = useVaultInfo();
  const withdrawableEtherQuery = useWithdrawable();

  const validationContextValue = useMemo(() => {
    if (
      [withdrawableEtherQuery.data].some(
        (value) => typeof value === 'undefined',
      )
    ) {
      return undefined;
    }

    return {
      withdrawableEther: withdrawableEtherQuery.data,
    } as WithdrawFormValidationContext;
  }, [withdrawableEtherQuery.data]);

  const validationContext = useAwaiter(validationContextValue).awaiter;

  const refetchWithdrawableEther = withdrawableEtherQuery.refetch;

  const invalidateWithdrawFormData = useCallback(
    () =>
      Promise.all([
        refetchWithdrawableEther({ cancelRefetch: true, throwOnError: false }),
        refetchVaultInfo(),
      ]),
    [refetchWithdrawableEther, refetchVaultInfo],
  );

  return {
    validationContext,
    withdrawableEtherQuery,
    invalidateWithdrawFormData,
  };
};
