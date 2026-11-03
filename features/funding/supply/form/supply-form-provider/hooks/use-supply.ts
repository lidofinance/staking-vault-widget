import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';

import {
  TransactionEntry,
  type TransactionsContext,
  toResumeKey,
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

export const useSupply = () => {
  const publicClient = usePublicClient();
  const { activeVault } = useVault();

  const prepareReportCalls = useReportCalls();
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

            // on resume after a confirmed fund the amount is already in the vault,
            // counting it again would overestimate the capacity
            const fundingAmount = completedSteps.has('fund') ? 0n : amount;

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

        const { success } = await withSuccess(
          sendTX({
            transactions: prepareTransactions,
            // confirmed unwrap and fund are skipped on retry, so they are not sent twice
            resumeKey: toResumeKey({
              vault: activeVault.address,
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

        return success;
      },
      [activeVault, prepareReportCalls, publicClient, sendTX],
    ),
    ...rest,
  };
};
