import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useReportCalls, useVault, vaultTexts } from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

const { loading, completed } = vaultTexts.actions.disconnectVault.applyReport;

export const useApplyReport = () => {
  const prepareReportCalls = useReportCalls();
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    applyReport: useCallback(async () => {
      invariant(activeVault, '[useAbandonDashboard] activeVault is undefined');

      const prepareTransactions = async () => {
        return await prepareReportCalls();
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
