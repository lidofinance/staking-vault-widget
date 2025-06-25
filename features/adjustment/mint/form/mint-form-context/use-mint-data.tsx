import { useCallback, useMemo } from 'react';

import {
  useMaxMintable,
  useValidateRecipientArgs,
  useVaultInfo,
} from 'modules/vaults';

import { useAwaiter } from 'shared/hooks/use-awaiter';

import { MintFormValidationContext } from '../types';

export const useMintData = () => {
  const validateRecipientArgs = useValidateRecipientArgs();
  const { refetchVaultInfo } = useVaultInfo();

  const mintableQuery = useMaxMintable(0n);

  const { data, refetch: refetchMintable } = mintableQuery;

  const validationContextValue = useMemo(() => {
    if (
      [
        data?.maxMintableStETH,
        data?.maxMintableShares,
        validateRecipientArgs,
      ].some((value) => typeof value === 'undefined')
    ) {
      return undefined;
    }

    return {
      mintableStETH: data?.maxMintableStETH,
      mintableWstETH: data?.maxMintableShares,
      validateRecipientArgs,
    } as MintFormValidationContext;
  }, [validateRecipientArgs, data?.maxMintableStETH, data?.maxMintableShares]);

  const validationContext = useAwaiter(validationContextValue).awaiter;

  const invalidateMintData = useCallback(
    async () =>
      Promise.all([
        refetchVaultInfo(),
        refetchMintable({ cancelRefetch: true, throwOnError: false }),
      ]),
    [refetchVaultInfo, refetchMintable],
  );

  return {
    validationContext,
    mintableQuery,
    invalidateMintData,
  };
};
