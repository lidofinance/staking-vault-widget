import { useCallback, useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { parseEther } from 'viem';
import type { RefetchOptions } from '@tanstack/react-query';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'modules/vaults';
import { useEthereumBalance, useWethBalance } from 'modules/web3';

import { FundFormSchemaType } from '../../types';
import { useMaxMintableSteth } from '.';

const ONE_ETH = parseEther('1');

export type FundFormData = ReturnType<typeof useFundFormData>;

export const useFundFormData = (
  token: FundFormSchemaType['token'],
  mintSteth: FundFormSchemaType['mintSteth'],
  amount: FundFormSchemaType['amount'],
) => {
  const { activeVault, refetchVaultInfo } = useVaultInfo();
  const ethBalanceQuery = useEthereumBalance();
  const wethBalanceQuery = useWethBalance();

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
