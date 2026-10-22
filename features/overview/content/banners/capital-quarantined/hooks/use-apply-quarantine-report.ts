import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useReportCalls, useVault, vaultTexts } from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

const { loading, completed } = vaultTexts.actions.report;

export const useApplyQuarantineReport = () => {
  const prepareReportCalls = useReportCalls();
  const { activeVault, invalidateVaultState } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    applyReport: useCallback(async () => {
      invariant(
        activeVault,
        '[useApplyQuarantineReport] activeVault is undefined',
      );

      // report can be applied by someone else after the UI was loaded,
      // in this case there is nothing to send, just refresh the vault state
      const isReportFresh = await activeVault.hub.read.isReportFresh([
        activeVault.address,
      ]);
      if (isReportFresh) {
        await invalidateVaultState();
        return true;
      }

      const { success } = await withSuccess(
        sendTX({
          transactions: prepareReportCalls,
          mainActionLoadingText: loading,
          mainActionCompleteText: completed,
        }),
      );

      return success;
    }, [activeVault, invalidateVaultState, prepareReportCalls, sendTX]),
    ...rest,
  };
};
