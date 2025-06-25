import { useCallback, useMemo } from 'react';
import type { RefetchOptions } from '@tanstack/react-query';

import { useMaxMintable, useReadDashboard, useVaultInfo } from 'modules/vaults';
import { useEthereumBalance, useWethBalance, ONE_ETH } from 'modules/web3';

import type { FundFormFieldValues } from 'features/supply/fund/form/types';

export const useFundFormData = (
  token: FundFormFieldValues['token'],
  mintSteth: FundFormFieldValues['mintSteth'],
  amount: FundFormFieldValues['amount'],
) => {
  const { refetchVaultInfo } = useVaultInfo();
  const ethBalanceQuery = useEthereumBalance();
  const wethBalanceQuery = useWethBalance();

  // checks if any amount of ETH is supplied can vault mint more stETH
  // as vault can be limited by both ETH supply and outside factors like tiers and lido tvl
  // any amount can be used but single weis might be caught in rounding
  const isStethMintableQuery = useReadDashboard({
    functionName: 'remainingMintingCapacityShares',
    args: [ONE_ETH],
    select: (data) => data > 0n,
    applyReport: true,
  });

  const maxMintableStethQuery = useMaxMintable(mintSteth ? amount : undefined);

  const invalidateFundFormData = useCallback(() => {
    const options: RefetchOptions = {
      cancelRefetch: true,
      throwOnError: false,
    };
    return Promise.all([
      refetchVaultInfo(),
      ethBalanceQuery.refetch(options),
      wethBalanceQuery.refetch(options),
      isStethMintableQuery.refetch(options),
      maxMintableStethQuery.refetch(options),
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    refetchVaultInfo,
    ethBalanceQuery.refetch,
    wethBalanceQuery.refetch,
    isStethMintableQuery.refetch,
    maxMintableStethQuery.refetch,
  ]);

  const balanceQuery = token === 'ETH' ? ethBalanceQuery : wethBalanceQuery;

  return useMemo(
    () => ({
      invalidateFundFormData,
      balanceQuery,
      maxMintableStethQuery,
      isStethMintableQuery,
    }),
    [
      balanceQuery,
      invalidateFundFormData,
      isStethMintableQuery,
      maxMintableStethQuery,
    ],
  );
};
