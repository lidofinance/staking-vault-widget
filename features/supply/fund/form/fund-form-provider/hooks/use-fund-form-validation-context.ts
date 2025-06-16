import { useMemo } from 'react';

import { useEthereumBalance, useWethBalance } from 'modules/web3';
import { useValidateRecipientArgs } from 'modules/vaults';

import type { FundFormDataValidationContext } from 'features/supply/fund/form/types';

export const useFundFormValidationContext = () => {
  const validateRecipientArgs = useValidateRecipientArgs();
  const ethBalanceQuery = useEthereumBalance();
  const wethBalanceQuery = useWethBalance();

  const validationContext = useMemo(() => {
    if (
      [ethBalanceQuery.data, wethBalanceQuery.data, validateRecipientArgs].some(
        (value) => typeof value === 'undefined',
      )
    ) {
      return undefined;
    }

    return {
      ethBalance: ethBalanceQuery.data,
      wethBalance: wethBalanceQuery.data,
      validateRecipientArgs,
    } as FundFormDataValidationContext;
  }, [validateRecipientArgs, ethBalanceQuery.data, wethBalanceQuery.data]);

  const isError = !!(ethBalanceQuery.error || wethBalanceQuery.error);

  return {
    validationContext,
    isError,
  };
};
