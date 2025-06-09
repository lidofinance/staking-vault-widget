import invariant from 'tiny-invariant';
import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';

import { getDashboardContract, useVaultInfo } from 'modules/vaults';
import { useLidoSDK } from 'modules/web3';

import { MintFormValidationContext } from '../types';
import { useAwaiter } from 'shared/hooks/use-awaiter';

export const useMintData = () => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();

  const { shares } = useLidoSDK();
  const mintableQuery = useQuery({
    queryKey: ['maxMintable', activeVault?.address],
    queryFn: async () => {
      invariant(
        activeVault?.address,
        '[useMintData] activeVault address is undefined',
      );
      const publicClient = shares.core.rpcProvider;
      const dashboard = getDashboardContract(activeVault?.owner, publicClient);

      const mintableWstETH = await dashboard.read.remainingMintingCapacity([
        0n,
      ]);
      const mintableStETH =
        mintableWstETH > 0n ? await shares.convertToSteth(mintableWstETH) : 0n;

      return {
        mintableStETH,
        mintableWstETH,
      };
    },
  });

  const { data, refetch: refetchMintable } = mintableQuery;

  const validationContextValue = useMemo(() => {
    if (
      [data?.mintableStETH, data?.mintableWstETH].some(
        (value) => typeof value === 'undefined',
      )
    ) {
      return undefined;
    }

    return {
      mintableStETH: data?.mintableStETH,
      mintableWstETH: data?.mintableWstETH,
    } as MintFormValidationContext;
  }, [data?.mintableStETH, data?.mintableWstETH]);

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
