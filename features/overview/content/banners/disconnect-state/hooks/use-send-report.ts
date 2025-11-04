import { useCallback } from 'react';

import { GoToVault, useReportCalls } from 'modules/vaults';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

export const useSendReport = () => {
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  return {
    applyReport: useCallback(async () => {
      // const loadingActionText = vaultTexts.actions.repay.loading(token);
      const loadingActionText = 'Applying report';
      const mainActionCompleteText = 'Applying report has done';

      const transactions: TransactionEntry[] = [...prepareReportCalls()];
      const { success } = await withSuccess(
        sendTX({
          transactions,
          forceAtomic: true,
          mainActionLoadingText: loadingActionText,
          mainActionCompleteText,
          renderSuccessContent: GoToVault,
        }),
      );

      return success;
    }, [prepareReportCalls, sendTX]),
    ...rest,
  };
};
