import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { usePublicClient } from 'wagmi';

import {
  TransactionEntry,
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

        let prepareTransactions: () => Promise<TransactionEntry[]> = () =>
          Promise.reject(undefined);

        const calls: TransactionEntry[] = [];

        if (token === 'wETH') {
          calls.push({
            ...wethContract.encode.withdraw([amount]),
            loadingActionText: 'Unwrapping wETH',
          });
        }

        calls.push({
          ...activeVault.dashboard.encode.fund({ value: amount }),
          loadingActionText: vaultTexts.actions.supply.loading,
        });

        // minting stETH requires async data for report and minting balance
        if (mintSteth) {
          prepareTransactions = async () => {
            calls.push(...prepareReportCalls());

            const [maxMintableShares] = await readWithReport({
              contracts: [
                activeVault.dashboard.prepare.remainingMintingCapacityShares([
                  amount,
                ]),
              ],
              publicClient,
              report: activeVault.report,
            });

            calls.push({
              ...activeVault.dashboard.encode.mintShares([
                mintAddress,
                maxMintableShares,
              ]),
              loadingActionText: vaultTexts.actions.mint.loading('stETH'),
            });

            return calls;
          };
        }

        const { success } = await withSuccess(
          sendTX({
            transactions: mintSteth ? prepareTransactions : calls,
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
