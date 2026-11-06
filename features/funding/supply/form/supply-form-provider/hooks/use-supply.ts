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
import { awaitWithTimeout } from 'utils/await-with-timeout';
import { waitForRpcBlock } from 'utils/wait-for-rpc-block';

import {
  getMintFunding,
  getSupplyResumeKey,
  getSupplyResumeState,
} from '../supply-resume';

// RPC normally reaches a just mined block within seconds; after the timeout
// the capacity is read anyway (it may then miss the fund and be lower, never higher)
const FUNDED_RPC_BLOCK_TIMEOUT_MS = 30_000;

export const useSupply = () => {
  const publicClient = usePublicClient();
  const { activeVault } = useVault();

  const prepareReportCalls = useReportCalls();
  const { getLatestTxBlock } = useLidoSDK();
  const { sendTX, ...rest } = useSendTransaction();

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
              await awaitWithTimeout(
                waitForRpcBlock(publicClient, getLatestTxBlock() ?? 0n),
                FUNDED_RPC_BLOCK_TIMEOUT_MS,
              ).catch(() => undefined);
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
            resumeKey: getSupplyResumeKey(activeVault.address, {
              amount,
              mintSteth,
              token,
              mintAddress,
            }),
            allowRetryAfterPartialSuccess: true,
            mainActionLoadingText: vaultTexts.actions.supply.loading,
            mainActionCompleteText: vaultTexts.actions.supply.completed(token),
            renderSuccessContent: GoToVault,
          }),
        );

        // stopped by the user after confirmed steps: the form is reset, a new submit starts over
        return { success, isAborted: error instanceof OperationAbortedError };
      },
      [activeVault, getLatestTxBlock, prepareReportCalls, publicClient, sendTX],
    ),
    ...rest,
  };
};
