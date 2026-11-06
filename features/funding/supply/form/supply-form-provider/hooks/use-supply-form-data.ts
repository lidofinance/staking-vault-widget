import { useCallback, useMemo, useRef } from 'react';
import { type RefetchOptions } from '@tanstack/react-query';

import { useMaxMintable, useReadDashboard, useVault } from 'modules/vaults';
import {
  useEthereumBalance,
  useLidoSDK,
  useWethBalance,
  ONE_ETH,
} from 'modules/web3';
import { waitForRpcBlockWithin } from 'utils/wait-for-rpc-block';

import type { SupplyFormFieldValues } from 'features/funding/supply/form/types';

import { getMintFunding, getSupplyResumeState } from '../supply-resume';

export const useSupplyFormData = (
  token: SupplyFormFieldValues['token'],
  mintSteth: SupplyFormFieldValues['mintSteth'],
  amount: SupplyFormFieldValues['amount'],
  // steps confirmed for the current values by a failed attempt, a resubmit skips them
  completedSteps: ReadonlySet<string>,
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

  // quoted as the resubmit mints: a confirmed fund is not added again
  const maxMintableStethQuery = useMaxMintable(
    !mintSteth
      ? undefined
      : amount === null
        ? amount
        : getMintFunding(amount, completedSteps),
  );
  const { isFunded, balanceCheck } = getSupplyResumeState(completedSteps);
  // wETH unwrapped, fund failed: a resubmit supplies the ETH the unwrap gave
  const isUnwrapped = balanceCheck === 'eth';

  // the background wait for balances of the latest submit: a newer submit supersedes it,
  // so polling loops don't pile up against a lagging RPC. Leaving the page does not stop
  // it: the ETH/wETH balance queries are shared, other pages need them refetched too
  // (the wait is bounded by its timeout).
  const balanceWaitRef = useRef<AbortController>();
  // stable, unlike the query result objects, so the submit and Retry callbacks built on
  // invalidateSupplyFormData are not recreated on every balance poll
  const { refetch: refetchEthBalance } = ethBalanceQuery;
  const { refetch: refetchWethBalance } = wethBalanceQuery;

  // `awaitBalances`: after a failed attempt the submit waits for the balances, so a Retry
  // (queued meanwhile) is validated against them: e.g. a confirmed unwrap is checked
  // against the ETH it gave, not the ETH balance from before it. After a success they
  // load in the background: the reset form is usable at once.
  const invalidateSupplyFormData = useCallback(
    async ({ awaitBalances = false }: { awaitBalances?: boolean } = {}) => {
      const options: RefetchOptions = {
        cancelRefetch: true,
        throwOnError: false,
      };
      // wallet balances are read at the latest RPC block, so wait until it includes
      // the latest own tx, otherwise a lagging node returns the balance before it
      // (after the timeout balances are read anyway and the balance polling catches up)
      const refetchBalances = async (signal: AbortSignal) => {
        await waitForRpcBlockWithin(publicClient, getLatestTxBlock() ?? 0n, {
          signal,
        });
        return Promise.all([
          refetchEthBalance(options),
          refetchWethBalance(options),
        ]);
      };
      balanceWaitRef.current?.abort();
      const controller = new AbortController();
      balanceWaitRef.current = controller;
      const balancesRefetched = refetchBalances(controller.signal).catch(() => {
        // superseded by a newer submit, which refetches the balances itself
      });
      if (!awaitBalances) return invalidateVaultState();
      await Promise.all([balancesRefetched, invalidateVaultState()]);
    },
    [
      invalidateVaultState,
      publicClient,
      getLatestTxBlock,
      refetchEthBalance,
      refetchWethBalance,
    ],
  );

  const balanceQuery = token === 'ETH' ? ethBalanceQuery : wethBalanceQuery;

  return useMemo(
    () => ({
      invalidateSupplyFormData,
      balanceQuery,
      maxMintableStethQuery,
      isStethMintableQuery,
      // the amount is already in the vault, a resubmit only mints
      isFunded,
      isUnwrapped,
    }),
    [
      isFunded,
      isUnwrapped,
      balanceQuery,
      invalidateSupplyFormData,
      isStethMintableQuery,
      maxMintableStethQuery,
    ],
  );
};
