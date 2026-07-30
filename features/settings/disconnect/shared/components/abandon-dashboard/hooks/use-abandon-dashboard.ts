import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useVault, vaultTexts } from 'modules/vaults';
import {
  type TransactionEntry,
  useDappStatus,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

const { loading, completeActionText } =
  vaultTexts.actions.disconnectVault.abandonDashboard;

export const useAbandonDashboard = () => {
  const { address } = useDappStatus();
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    abandon: useCallback(async () => {
      invariant(activeVault, '[useAbandonDashboard] activeVault is undefined');
      invariant(address, '[useAbandonDashboard] address is undefined');

      const prepareTransactions = async () => {
        const calls: TransactionEntry[] = [
          {
            ...activeVault.dashboard.encode.abandonDashboard([address]),
            loadingActionText: loading,
          },
        ];

        return calls;
      };

      const { success } = await withSuccess(
        sendTX({
          transactions: prepareTransactions,
          mainActionLoadingText: loading,
          mainActionCompleteText: completeActionText(address),
        }),
      );

      return success;
    }, [activeVault, sendTX, address]),
    ...rest,
  };
};
