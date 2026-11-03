import { useCallback, useEffect, useRef } from 'react';

import { useReportCalls, useVault } from 'modules/vaults';
import { ReportAlreadyAppliedError } from 'modules/vaults/consts/errors';
import { vaultTexts } from 'modules/vaults/consts/texts';
import { useSendTransaction, withSuccess } from 'modules/web3';

type UseSendReportOptions = {
  loadingText?: string;
  completedText?: string;
};

const { loading: defaultLoadingText, completed: defaultCompletedText } =
  vaultTexts.actions.report;

// Single entry point for applying a fresh oracle report from the UI
export const useSendReport = ({
  loadingText = defaultLoadingText,
  completedText = defaultCompletedText,
}: UseSendReportOptions = {}) => {
  const prepareReportCalls = useReportCalls();
  const { invalidateVaultState } = useVault();
  const { sendTX, retryEvent, ...rest } = useSendTransaction();

  // Guards against a double click/Retry firing a second report request
  // while the previous one is still in progress
  const isSubmittingRef = useRef(false);

  const applyReport = useCallback(async () => {
    if (isSubmittingRef.current) return false;
    isSubmittingRef.current = true;

    try {
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
          mainActionLoadingText: loadingText,
          mainActionCompleteText: completedText,
        }),
      );

      return success;
    } finally {
      isSubmittingRef.current = false;
    }
  }, [
    completedText,
    invalidateVaultState,
    loadingText,
    prepareReportCalls,
    sendTX,
  ]);

  useEffect(
    () => retryEvent.subscribe(() => void applyReport()),
    [retryEvent, applyReport],
  );

  return { applyReport, ...rest };
};
