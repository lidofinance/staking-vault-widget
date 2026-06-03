import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVault, vaultTexts, GoToVault } from 'modules/vaults';

import { useIsForceRebalance } from './use-is-force-rebalance';

import type { RebalanceFormValidatedValues } from 'features/rebalance/types';

const { title, submit } = vaultTexts.actions.rebalance;

export const useRebalance = () => {
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();
  const isForceRebalance = useIsForceRebalance();

  return {
    rebalance: useCallback(
      async ({
        rebalanceAmount,
        supplyEth,
        isSupplyEth,
      }: RebalanceFormValidatedValues) => {
        invariant(activeVault, '[useRebalance] activeVault is undefined');

        const { hub, dashboard, address } = activeVault;
        const calls: TransactionEntry[] = [];

        if (isForceRebalance) {
          calls.push({
            ...hub.encode.forceRebalance([address]),
            loadingActionText: submit.forceRebalance,
          });
        } else {
          calls.push({
            ...dashboard.encode.rebalanceVaultWithEther([rebalanceAmount]),
            value: isSupplyEth ? supplyEth : 0n,
            loadingActionText: title,
          });
        }

        const { success } = await withSuccess(
          sendTX({
            transactions: calls,
            mainActionLoadingText: title,
            mainActionCompleteText: title,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault, sendTX, isForceRebalance],
    ),
    ...rest,
  };
};
