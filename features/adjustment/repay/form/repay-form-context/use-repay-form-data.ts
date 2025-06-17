/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { useCallback, useMemo } from 'react';

import { useVaultInfo } from 'modules/vaults';
import { useStethBalance, useWstethBalance } from 'modules/web3';

import { bigIntMin } from 'utils/bigint-math';
import { useAwaiter } from 'shared/hooks/use-awaiter';

import { useLiability } from './use-liability';
import type { RepayFormValidationContext } from '../types';

export const useRepayFormData = () => {
  const { refetchVaultInfo } = useVaultInfo();
  const liabilityQuery = useLiability();
  const stethBalanceQuery = useStethBalance();
  const wstethBalanceQuery = useWstethBalance();

  const isMaxRepayableLoading =
    stethBalanceQuery.isLoading ||
    wstethBalanceQuery.isLoading ||
    liabilityQuery.isLoading;

  const maxRepayableStETH =
    stethBalanceQuery.data && liabilityQuery.data
      ? bigIntMin(stethBalanceQuery.data, liabilityQuery.data.liabilitySteth)
      : undefined;

  const maxRepayableWstETH =
    wstethBalanceQuery.data && liabilityQuery.data
      ? bigIntMin(wstethBalanceQuery.data, liabilityQuery.data.liabilityWsteth)
      : undefined;

  const validationContextValue: RepayFormValidationContext | undefined =
    useMemo(() => {
      if (
        [maxRepayableStETH, maxRepayableWstETH].some(
          (data) => typeof data === 'undefined',
        )
      ) {
        return undefined;
      }

      return {
        maxRepayableStETH: maxRepayableStETH!,
        maxRepayableWstETH: maxRepayableWstETH!,
      };
    }, [maxRepayableStETH, maxRepayableWstETH]);

  const validationContext = useAwaiter(validationContextValue).awaiter;

  const invalidateRepayFormData = useCallback(async () => {
    const options = { cancelRefetch: true, throwOnError: false };
    return Promise.all([
      refetchVaultInfo(),
      liabilityQuery.refetch(options),
      stethBalanceQuery.refetch(options),
      wstethBalanceQuery.refetch(options),
    ]);
  }, [liabilityQuery, refetchVaultInfo, stethBalanceQuery, wstethBalanceQuery]);

  return {
    validationContext,
    invalidateRepayFormData,
    maxRepayableStETH,
    maxRepayableWstETH,
    isMaxRepayableLoading,
  };
};
