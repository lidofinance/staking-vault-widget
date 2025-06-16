import { useCallback, useMemo } from 'react';

import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useValidateRecipientArgs, useVaultInfo } from 'modules/vaults';

import { useWithdrawable } from '../hooks';

import type { WithdrawFormValidationContext } from '../types';

export const useWithdrawValidationContext = () => {
  const { refetchVaultInfo } = useVaultInfo();
  const validateRecipientArgs = useValidateRecipientArgs();
  const withdrawableEtherQuery = useWithdrawable();

  const validationContextValue = useMemo(() => {
    if (
      [withdrawableEtherQuery.data, validateRecipientArgs].some(
        (value) => typeof value === 'undefined',
      )
    ) {
      return undefined;
    }

    return {
      withdrawableEther: withdrawableEtherQuery.data,
      validateRecipientArgs,
    } as WithdrawFormValidationContext;
  }, [withdrawableEtherQuery.data, validateRecipientArgs]);

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
