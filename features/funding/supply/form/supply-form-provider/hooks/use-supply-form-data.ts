import { useCallback, useMemo } from 'react';
import { type RefetchOptions } from '@tanstack/react-query';

import { useMaxMintable, useReadDashboard, useVault } from 'modules/vaults';
import {
  useEthereumBalance,
  useLidoSDK,
  useWethBalance,
  ONE_ETH,
} from 'modules/web3';
import { awaitWithTimeout } from 'utils/await-with-timeout';
import { waitForRpcBlock } from 'utils/wait-for-rpc-block';

import type { SupplyFormFieldValues } from 'features/funding/supply/form/types';

// RPC normally reaches a just mined block within seconds; after the timeout
// balances are read anyway and the balance polling catches up
// (the wait runs in the background, so it only bounds when the balances are refetched)
const BALANCE_RPC_BLOCK_TIMEOUT_MS = 30_000;

export const useSupplyFormData = (
  token: SupplyFormFieldValues['token'],
  mintSteth: SupplyFormFieldValues['mintSteth'],
  amount: SupplyFormFieldValues['amount'],
) => {
  const { invalidateVaultState } = useVault();
  const { publicClient, getLatestTxBlock } = useLidoSDK();
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
    // wallet balances are read at the latest RPC block, so wait until it includes
    // the latest own tx, otherwise a lagging node returns the balance before it
    const refetchBalances = async () => {
      await awaitWithTimeout(
        waitForRpcBlock(publicClient, getLatestTxBlock() ?? 0n),
        BALANCE_RPC_BLOCK_TIMEOUT_MS,
      ).catch(() => undefined);
      return Promise.all([
        ethBalanceQuery.refetch(options),
        wethBalanceQuery.refetch(options),
      ]);
    };
    // not awaited: the submit (and a queued Retry) is not held while the RPC catches up,
    // the balances update on their own when the block is reached
    void refetchBalances();
    return invalidateVaultState();
  }, [
    invalidateVaultState,
    publicClient,
    getLatestTxBlock,
    ethBalanceQuery,
    wethBalanceQuery,
  ]);

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
