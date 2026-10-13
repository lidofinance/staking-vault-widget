import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useReportCalls, useVault, vaultTexts } from 'modules/vaults';
import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

const { loading, completed } =
  vaultTexts.actions.disconnectVault.voluntaryDisconnect;

export const useVoluntaryDisconnect = () => {
  const prepareReportCalls = useReportCalls();
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    disconnect: useCallback(async () => {
      invariant(
        activeVault,
        '[useVoluntaryDisconnect] activeVault is undefined',
      );

      const prepareTransactions = async () => {
        const calls: TransactionEntry[] = await prepareReportCalls();

        calls.push({
          ...activeVault.dashboard.encode.voluntaryDisconnect(),
          loadingActionText: loading,
        });

        return calls;
      };

      const { success } = await withSuccess(
        sendTX({
          transactions: prepareTransactions,
          mainActionLoadingText: loading,
          mainActionCompleteText: completed,
        }),
      );

      return success;
    }, [activeVault, prepareReportCalls, sendTX]),
    ...rest,
  };
};
