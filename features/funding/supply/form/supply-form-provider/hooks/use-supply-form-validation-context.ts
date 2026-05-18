import { useMemo } from 'react';

import { useEthereumBalance, useWethBalance } from 'modules/web3';
import { useValidateRecipientArgs } from 'modules/vaults';
import { useVerificationBannerDefender } from 'shared/components';

import type { SupplyFormDataValidationContext } from 'features/funding/supply/form/types';

export const useSupplyFormValidationContext = () => {
  const validateRecipientArgs = useValidateRecipientArgs();
  const ethBalanceQuery = useEthereumBalance();
  const wethBalanceQuery = useWethBalance();
  const {
    isReady: isVerificationReady,
    isNotOwnerWarningVisible,
    isMultipleOwnersWarningVisible,
    isUnguaranteedDepositsWarningVisible,
  } = useVerificationBannerDefender('supply');

  const validationContext = useMemo(() => {
    if (
      !isVerificationReady ||
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
      additionalVerification: {
        notOwner: isNotOwnerWarningVisible,
        multipleOwners: isMultipleOwnersWarningVisible,
        unguaranteedDeposits: isUnguaranteedDepositsWarningVisible,
      },
    } as SupplyFormDataValidationContext;
  }, [
    validateRecipientArgs,
    ethBalanceQuery.data,
    wethBalanceQuery.data,
    isVerificationReady,
    isNotOwnerWarningVisible,
    isMultipleOwnersWarningVisible,
    isUnguaranteedDepositsWarningVisible,
  ]);

  const isError = !!(ethBalanceQuery.error || wethBalanceQuery.error);

  return {
    validationContext,
    isError,
  };
};
