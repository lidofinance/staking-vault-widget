import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { GoToVault, useReportCalls, useVault } from 'modules/vaults';
import { vaultTexts } from 'modules/vaults/consts/texts';
import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

const { settleLidoFees } = vaultTexts.actions;

export const useSettleLidoFees = () => {
  const { activeVault, invalidateVaultState } = useVault();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  return {
    settleLidoFees: useCallback(async () => {
      invariant(activeVault, '[useSettleLidoFees] activeVault is not defined');

      const mainActionLoadingText = settleLidoFees.loading;
      const mainActionCompleteText = settleLidoFees.completed;
      const { hub, address } = activeVault;

      const transactions: TransactionEntry[] = [...prepareReportCalls()];
      transactions.push({
        ...hub.encode.settleLidoFees([address]),
        loadingActionText: mainActionLoadingText,
      });

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
    }, [prepareReportCalls, sendTX, invalidateVaultState, activeVault]),
    ...rest,
  };
};
