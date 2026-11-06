import { useCallback, useEffect, useRef } from 'react';

import { useReportCalls, useVault } from 'modules/vaults';
import { ReportAlreadyAppliedError } from 'modules/vaults/consts/errors';
import { vaultTexts } from 'modules/vaults/consts/texts';
import { useSendTransaction, withSuccess } from 'modules/web3';
import type { ModalRenderSuccessContent } from 'shared/components/transaction-modal';
import { runExclusive } from 'utils/run-exclusive';

import { sendReportAndRefresh } from './send-report-and-refresh';

type UseSendReportOptions = {
  loadingText?: string;
  completedText?: string;
  renderSuccessContent?: ModalRenderSuccessContent;
};

const { loading: defaultLoadingText, completed: defaultCompletedText } =
  vaultTexts.actions.report;

// Single entry point for applying a fresh oracle report from the UI
export const useSendReport = ({
  loadingText = defaultLoadingText,
  completedText = defaultCompletedText,
  renderSuccessContent,
}: UseSendReportOptions = {}) => {
  const prepareReportCalls = useReportCalls();
  const { invalidateVaultState } = useVault();
  const { sendTX, retryEvent, ...rest } = useSendTransaction();

  // Guards against a double click/Retry firing a second report request
  // while the previous one is still in progress
  const isSubmittingRef = useRef(false);

  const applyReport = useCallback(
    () =>
      runExclusive(
        isSubmittingRef,
        () =>
          sendReportAndRefresh(
            () =>
              withSuccess(
                sendTX({
                  transactions: async () => {
                    const calls = await prepareReportCalls();
                    // report can be applied by someone else after the UI was loaded,
                    // in this case there is nothing to send, the vault state is refreshed below
                    if (calls.length === 0) {
                      throw new ReportAlreadyAppliedError();
                    }
                    return calls;
                  },
                  mainActionLoadingText: loadingText,
                  mainActionCompleteText: completedText,
                  renderSuccessContent,
                }),
              ),
            invalidateVaultState,
          ),
        false,
      ),
    [
      completedText,
      invalidateVaultState,
      loadingText,
      prepareReportCalls,
      renderSuccessContent,
      sendTX,
    ],
  );

  useEffect(
    () => retryEvent.subscribe(() => applyReport()),
    [retryEvent, applyReport],
  );

  return { applyReport, ...rest };
};
