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
  const { invalidateVaultState } = useVault();
  const prepareReportCalls = useReportCalls();

  return {
    applyReport: useCallback(async () => {
      const mainActionLoadingText = vaultTexts.actions.report.loading;
      const mainActionCompleteText = vaultTexts.actions.report.completed;

      const transactions: TransactionEntry[] = await prepareReportCalls();
      const { success } = await withSuccess(
        sendTX({
          transactions,
          forceAtomic: true,
          mainActionLoadingText,
          mainActionCompleteText,
          renderSuccessContent: GoToVault,
        }),
      );

      await invalidateVaultState();
      return success;
    }, [prepareReportCalls, sendTX, invalidateVaultState]),
    ...rest,
  };
};
