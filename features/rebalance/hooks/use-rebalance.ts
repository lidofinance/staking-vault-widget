import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVault, vaultTexts, GoToVault } from 'modules/vaults';

import type { RebalanceFormValidatedValues } from 'features/rebalance/types';

export const useRebalance = () => {
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    rebalance: useCallback(
      async ({ rebalanceAmount, supplyEth }: RebalanceFormValidatedValues) => {
        invariant(activeVault, '[useRebalance] activeVault is undefined');

        const calls: TransactionEntry[] = [];

        calls.push({
          ...activeVault.dashboard.encode.rebalanceVaultWithEther([
            rebalanceAmount,
          ]),
          value: supplyEth,
          loadingActionText: vaultTexts.actions.rebalance.title,
        });

        const { success } = await withSuccess(
          sendTX({
            transactions: calls,
            mainActionLoadingText: vaultTexts.actions.rebalance.title,
            mainActionCompleteText: vaultTexts.actions.rebalance.title,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault, sendTX],
    ),
    ...rest,
  };
};
