import { useMemo } from 'react';

import { useEthereumBalance, useWethBalance } from 'modules/web3';

import type { FundFormDataValidationContext } from 'features/supply/fund/form/types';

export const useFundFormValidationContext = () => {
  const ethBalanceQuery = useEthereumBalance();
  const wethBalanceQuery = useWethBalance();

  const validationContext = useMemo(() => {
    if (
      [ethBalanceQuery.data, wethBalanceQuery.data].some(
        (value) => typeof value === 'undefined',
      )
    ) {
      return undefined;
    }

    return {
      ethBalance: ethBalanceQuery.data,
      wethBalance: wethBalanceQuery.data,
    } as FundFormDataValidationContext;
  }, [ethBalanceQuery.data, wethBalanceQuery.data]);

  const isError = !!(ethBalanceQuery.error || wethBalanceQuery.error);

  return {
    validationContext,
    isError,
  };
};
