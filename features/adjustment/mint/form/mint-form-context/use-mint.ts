import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { encodeFunctionData } from 'viem';

import { useSendTransaction, withSuccess } from 'modules/web3';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useReportCalls, useVaultInfo, vaultTexts } from 'modules/vaults';

import { GoToVault } from 'modules/vaults/components/go-to-vault';
import { MintFormValidatedValues } from '../types';

export const useMint = () => {
  const { activeVault } = useVaultInfo();
  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    mint: useCallback(
      async ({ amount, recipient, token }: MintFormValidatedValues) => {
        invariant(activeVault?.owner, '[useMint] owner is undefined');

        const loadingActionText = vaultTexts.actions.mint.loading(token);
        const mainActionCompleteText = vaultTexts.actions.mint.completed(token);

        const mintCall = {
          to: activeVault.owner,
          data: encodeFunctionData({
            abi: dashboardAbi,
            functionName: token === 'stETH' ? 'mintStETH' : 'mintWstETH',
            args: [recipient, amount],
          }),
          loadingActionText,
        };

        // if we have to post report, there will be extra modal due to async fetch
        const transactions = [...prepareReportCalls(), mintCall];

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
      },
      [activeVault?.owner, prepareReportCalls, sendTX],
    ),
    ...rest,
  };
};
