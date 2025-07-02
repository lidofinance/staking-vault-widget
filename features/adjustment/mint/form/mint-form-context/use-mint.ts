import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import { useSendTransaction, withSuccess } from 'modules/web3';

import { useReportCalls, useVault, vaultTexts } from 'modules/vaults';

import { GoToVault } from 'modules/vaults/components/go-to-vault';
import { MintFormValidatedValues } from '../types';

export const useMint = () => {
  const { activeVault } = useVault();
  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    mint: useCallback(
      async ({ amount, recipient, token }: MintFormValidatedValues) => {
        invariant(activeVault, '[useMint] activeVault is undefined');

        const loadingActionText = vaultTexts.actions.mint.loading(token);
        const mainActionCompleteText = vaultTexts.actions.mint.completed(token);

        const mintCall = {
          ...activeVault.dashboard.encode[
            token === 'stETH' ? 'mintStETH' : 'mintWstETH'
          ]([recipient, amount]),
          loadingActionText,
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: async () => [...prepareReportCalls(), mintCall],
            forceAtomic: true,
            mainActionLoadingText: loadingActionText,
            mainActionCompleteText,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault, prepareReportCalls, sendTX],
    ),
    ...rest,
  };
};
