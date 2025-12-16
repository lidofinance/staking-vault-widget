import { useCallback } from 'react';

import {
  GoToVault,
  useReportCalls,
  useVault,
  vaultTexts,
} from 'modules/vaults';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

export const useSendReport = () => {
  const { sendTX, ...rest } = useSendTransaction();
  const { refetch } = useVault();
  const prepareReportCalls = useReportCalls();

  return {
    applyReport: useCallback(async () => {
      const mainActionLoadingText = vaultTexts.actions.report.loading;
      const mainActionCompleteText = vaultTexts.actions.report.completed;

      const transactions: TransactionEntry[] = [...prepareReportCalls()];
      const { success } = await withSuccess(
        sendTX({
          transactions,
          forceAtomic: true,
          mainActionLoadingText,
          mainActionCompleteText,
          renderSuccessContent: GoToVault,
        }),
      );

      await refetch({ cancelRefetch: true, throwOnError: false });
      return success;
    }, [prepareReportCalls, sendTX, refetch]),
    ...rest,
  };
};
