import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  useVault,
  vaultTexts,
  GoToVault,
  getWethContract,
  useReportCalls,
} from 'modules/vaults';
import {
  useSendTransaction,
  withSuccess,
  TransactionEntry,
  useLidoSDK,
  toResumeKey,
} from 'modules/web3';

import type { WithdrawFormValidatedValues } from '../types';

export const useWithdraw = () => {
  const { activeVault } = useVault();
  const { publicClient } = useLidoSDK();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  const withdraw = useCallback(
    async ({ amount, recipient, token }: WithdrawFormValidatedValues) => {
      invariant(activeVault, '[useWithdraw] activeVault is undefined');
      const wethContract = getWethContract(publicClient);

      const calls: TransactionEntry[] = [];

      // withdraw call
      calls.push({
        ...activeVault.dashboard.encode.withdraw([recipient, amount]),
        loadingActionText: vaultTexts.actions.withdraw.loading,
        stepKey: 'withdraw',
      });

      // eth -> weth wrap call
      if (token === 'wETH') {
        calls.push({
          ...wethContract.encode.deposit({ value: amount }),
          loadingActionText: vaultTexts.actions.weth.loadingWrap,
          stepKey: 'wrap',
        });
      }

      const { success } = await withSuccess(
        sendTX({
          transactions: async () => [...(await prepareReportCalls()), ...calls],
          forceAtomic: true,
          // confirmed withdraw is skipped on retry, so only the wrap is sent again
          resumeKey: toResumeKey({
            vault: activeVault.address,
            amount,
            recipient,
            token,
          }),
          allowRetryAfterPartialSuccess: true,
          mainActionLoadingText: vaultTexts.actions.withdraw.loading,
          mainActionCompleteText: vaultTexts.actions.withdraw.completed(token),
          renderSuccessContent: GoToVault,
        }),
      );

      return success;
    },
    [activeVault, publicClient, prepareReportCalls, sendTX],
  );

  return {
    withdraw,
    ...rest,
  };
};
