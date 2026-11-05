import { useCallback, useEffect } from 'react';
import invariant from 'tiny-invariant';

import {
  ReportAlreadyAppliedError,
  useReportCalls,
  useVault,
  vaultTexts,
} from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

const { loading, completed } = vaultTexts.actions.report;

export const useApplyQuarantineReport = () => {
  const prepareReportCalls = useReportCalls();
  const { activeVault, invalidateVaultState } = useVault();
  const { sendTX, retryEvent, ...rest } = useSendTransaction();

  const applyReport = useCallback(async () => {
    invariant(
      activeVault,
      '[useApplyQuarantineReport] activeVault is undefined',
    );

    const prepareTransactions = async () => {
      const calls = await prepareReportCalls();
      // report can be applied by someone else after the UI was loaded,
      // in this case there is nothing to send, just refresh the vault state
      if (calls.length === 0) {
        void invalidateVaultState();
        throw new ReportAlreadyAppliedError();
      }
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
  }, [activeVault, invalidateVaultState, prepareReportCalls, sendTX]);

  useEffect(
    () => retryEvent.subscribe(() => void applyReport()),
    [retryEvent, applyReport],
  );

  return { applyReport, ...rest };
};
