import invariant from 'tiny-invariant';
import { useCallback, useState } from 'react';

import {
  useVault,
  vaultTexts,
  GoToVault,
  useReportCalls,
} from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

export const useDisburse = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { activeVault } = useVault();
  const prepareReportCalls = useReportCalls();
  const owner = activeVault?.owner;
  const { sendTX, ...rest } = useSendTransaction();

  return {
    disburse: useCallback(async () => {
      invariant(owner, '[useClaim] owner is undefined');
      setSubmitting(true);

      const loadingActionText = vaultTexts.actions.disburse.loading;
      const mainActionCompleteText = vaultTexts.actions.disburse.completed;

      const claimCall = {
        ...activeVault.dashboard.encode.disburseFee(),
        loadingActionText,
      };

      const { success } = await withSuccess(
        sendTX({
          transactions: async () => [...prepareReportCalls(), claimCall],
          mainActionLoadingText: loadingActionText,
          mainActionCompleteText,
          renderSuccessContent: GoToVault,
        }),
      );

      setSubmitting(false);
      return success;
    }, [activeVault?.dashboard.encode, owner, prepareReportCalls, sendTX]),
    isSubmitting,
    ...rest,
  };
};
