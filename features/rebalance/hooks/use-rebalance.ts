import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  useReportCalls,
  useVaultOverviewData,
} from 'modules/vaults';

import type { RebalanceFormValidatedValues } from '../types';

const { submit } = vaultTexts.actions.rebalance;

export const useRebalance = () => {
  const { activeVault } = useVault();
  const { data: vaultOverviewData } = useVaultOverviewData();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  return {
    rebalance: useCallback(
      async ({
        rebalanceAmount,
        supplyEth,
        isSupplyEth,
      }: RebalanceFormValidatedValues) => {
        invariant(activeVault, '[useRebalance] activeVault is undefined');
        invariant(
          vaultOverviewData,
          '[useRebalance] vaultOverviewData is undefined',
        );

        const { isForceRebalance } = vaultOverviewData;

        const { hub, dashboard, address } = activeVault;
        const calls: TransactionEntry[] = [...(await prepareReportCalls())];

        const modalTitle =
          !isForceRebalance && isSupplyEth && supplyEth > 0n
            ? submit.supplyAndRebalance
            : submit.rebalance;

        if (isForceRebalance) {
          calls.push({
            ...hub.encode.forceRebalance([address]),
            loadingActionText: submit.forceRebalance,
          });
        } else {
          calls.push({
            ...dashboard.encode.rebalanceVaultWithEther([rebalanceAmount]),
            value: isSupplyEth ? supplyEth : 0n,
            loadingActionText: modalTitle,
          });
        }

        const { success } = await withSuccess(
          sendTX({
            transactions: calls,
            mainActionLoadingText: modalTitle,
            mainActionCompleteText: modalTitle,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault, sendTX, prepareReportCalls, vaultOverviewData],
    ),
    ...rest,
  };
};
