import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';

import {
  OperationAbortedError,
  TransactionEntry,
  type TransactionsContext,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  getWethContract,
} from 'modules/vaults';

import { readWithReport, useReportCalls } from 'modules/vaults/report';
import type { SupplyFormValidatedValues } from 'features/funding/supply/form/types';
import { waitForRpcBlockWithin } from 'utils/wait-for-rpc-block';

import {
  getMintFunding,
  getSupplyResumeKey,
  getSupplyResumeState,
} from '../supply-resume';

export const useSupply = () => {
  const publicClient = usePublicClient();
  const { activeVault } = useVault();

  const prepareReportCalls = useReportCalls();
  const { getLatestTxBlock } = useLidoSDK();
  const { sendTX, ...rest } = useSendTransaction();
  const { getCompletedSteps } = rest;

  return {
    supply: useCallback(
      async ({
        amount,
        mintSteth,
        token,
        mintAddress,
      }: SupplyFormValidatedValues) => {
        invariant(activeVault, '[useSupply] activeVault is undefined');
        const wethContract = getWethContract(publicClient);
        const resumeKey = getSupplyResumeKey(activeVault.address, {
          amount,
          mintSteth,
          token,
          mintAddress,
        });
        // a resume after a confirmed unwrap supplies the ETH it gave, not wETH
        const suppliedToken =
          getSupplyResumeState(getCompletedSteps(resumeKey)).balanceCheck ===
          'eth'
            ? 'ETH'
            : token;

        const prepareTransactions = async ({
          completedSteps,
        }: TransactionsContext) => {
          const calls: TransactionEntry[] = [];

          if (token === 'wETH') {
            calls.push({
              ...wethContract.encode.withdraw([amount]),
              loadingActionText: 'Unwrapping wETH',
              stepKey: 'unwrap',
            });
          }

          calls.push({
            ...activeVault.dashboard.encode.fund({ value: amount }),
            loadingActionText: vaultTexts.actions.supply.loading,
            stepKey: 'fund',
          });

          // minting stETH requires async data for report and minting balance
          if (mintSteth) {
            calls.push(...(await prepareReportCalls()));

            const fundingAmount = getMintFunding(amount, completedSteps);
            // the capacity is read without the fund then, so it has to be read at a block
            // that includes it: a lagging node would return a lower capacity
            if (getSupplyResumeState(completedSteps).isFunded) {
              // after the timeout the capacity is read anyway:
              // it may then miss the fund and be lower, never higher
              await waitForRpcBlockWithin(
                publicClient,
                getLatestTxBlock() ?? 0n,
              );
            }

            const [maxMintableShares] = await readWithReport({
              contracts: [
                activeVault.dashboard.prepare.remainingMintingCapacityShares([
                  fundingAmount,
                ]),
              ],
              publicClient,
              lazyOracle: activeVault.lazyOracle,
              report: activeVault.report,
              isReportFresh: activeVault.isReportFresh,
            });

            calls.push({
              ...activeVault.dashboard.encode.mintShares([
                mintAddress,
                maxMintableShares,
              ]),
              loadingActionText: vaultTexts.actions.mint.loading('stETH'),
              stepKey: 'mint',
            });
          }

          return calls;
        };

        const { success, error } = await withSuccess(
          sendTX({
            transactions: prepareTransactions,
            // all or nothing in AA, as withdraw and mint: executed calls of a partially
            // failed batch can't be mapped to steps, so a resubmit would fund again
            forceAtomic: true,
            // confirmed unwrap and fund are skipped on retry, so they are not sent twice
            resumeKey,
            allowRetryAfterPartialSuccess: true,
            mainActionLoadingText: vaultTexts.actions.supply.loading,
            mainActionCompleteText:
              vaultTexts.actions.supply.completed(suppliedToken),
            renderSuccessContent: GoToVault,
          }),
        );

        // stopped by the user after confirmed steps: the form is reset, a new submit starts over
        return { success, isAborted: error instanceof OperationAbortedError };
      },
      [
        activeVault,
        getCompletedSteps,
        getLatestTxBlock,
        prepareReportCalls,
        publicClient,
        sendTX,
      ],
    ),
    ...rest,
  };
};
