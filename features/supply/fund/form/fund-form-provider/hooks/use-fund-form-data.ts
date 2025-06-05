import { useCallback, useMemo } from 'react';
import { useReadContract } from 'wagmi';
import type { RefetchOptions } from '@tanstack/react-query';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'modules/vaults';
import { useEthereumBalance, useWethBalance, ONE_ETH } from 'modules/web3';

import type { FundFormFieldValues } from 'features/supply/fund/form/types';
import { useMaxMintableSteth } from '.';

export const useFundFormData = (
  token: FundFormFieldValues['token'],
  mintSteth: FundFormFieldValues['mintSteth'],
  amount: FundFormFieldValues['amount'],
) => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const ethBalanceQuery = useEthereumBalance();
  const wethBalanceQuery = useWethBalance();

  // checks if any amount of ETH is supplied can vault mint more stETH
  // as vault can be limited by both ETH supply and outside factors like tiers and lido tvl
  // any amount can be used but single weis might be caught in rounding
  const isStethMintableQuery = useReadContract({
    address: activeVault?.owner,
    abi: dashboardAbi,
    functionName: 'remainingMintingCapacity',
    args: [ONE_ETH],
    query: {
      enabled: !!activeVault?.owner,
      select: (data) => data > 0n,
    },
  });

  const maxMintableStethQuery = useMaxMintableSteth(
    mintSteth ? amount : undefined,
  );

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
