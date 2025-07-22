import { useCallback, useMemo } from 'react';
import { type RefetchOptions } from '@tanstack/react-query';

import { useMaxMintable, useReadDashboard, useVault } from 'modules/vaults';
import { useEthereumBalance, useWethBalance, ONE_ETH } from 'modules/web3';

import type { SupplyFormFieldValues } from 'features/funding/supply/form/types';

export const useSupplyFormData = (
  token: SupplyFormFieldValues['token'],
  mintSteth: SupplyFormFieldValues['mintSteth'],
  amount: SupplyFormFieldValues['amount'],
) => {
  const { invalidateVaultState } = useVault();
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

  const invalidateSupplyFormData = useCallback(() => {
    const options: RefetchOptions = {
      cancelRefetch: true,
      throwOnError: false,
    };
    return Promise.all([
      invalidateVaultState(),
      ethBalanceQuery.refetch(options),
      wethBalanceQuery.refetch(options),
    ]);
  }, [invalidateVaultState, ethBalanceQuery, wethBalanceQuery]);

  const balanceQuery = token === 'ETH' ? ethBalanceQuery : wethBalanceQuery;

  return useMemo(
    () => ({
      invalidateSupplyFormData,
      balanceQuery,
      maxMintableStethQuery,
      isStethMintableQuery,
    }),
    [
      balanceQuery,
      invalidateSupplyFormData,
      isStethMintableQuery,
      maxMintableStethQuery,
    ],
  );
};
