import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  useVault,
  vaultTexts,
  GoToVault,
  useReportCalls,
} from 'modules/vaults';
import {
  TransactionEntry,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

import type { RepayFormValidatedValues } from '../types';

export const useRepay = () => {
  const { activeVault } = useVault();
  const { stETH, wstETH } = useLidoSDK();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  return {
    burn: useCallback(
      async ({ amount, token }: RepayFormValidatedValues) => {
        invariant(activeVault?.dashboard, '[useMint] owner is undefined');

        const loadingActionText = vaultTexts.actions.repay.loading(token);
        const mainActionCompleteText =
          vaultTexts.actions.repay.completed(token);

        const prepareTransactions = async () => {
          const calls: TransactionEntry[] = [...prepareReportCalls()];

          const isSteth = token === 'stETH';
          const tokenContract = isSteth ? stETH : wstETH;

          const allowance = await tokenContract.allowance({
            to: activeVault.dashboard.address,
          });
          const needsAllowance = allowance < amount;
          if (needsAllowance) {
            const approveCall = {
              ...(await tokenContract.populateApprove({
                amount,
                to: activeVault.dashboard.address,
              })),
              loadingActionText: vaultTexts.actions.approve.loading(token),
            };
            calls.push(approveCall);
          }
          // TODO: convert stETH to shares with correct rounding and call burnShares
          calls.push({
            ...activeVault.dashboard.encode[
              token === 'stETH' ? 'burnStETH' : 'burnWstETH'
            ]([amount]),
            loadingActionText,
          });
          return calls;
        };

        const { success } = await withSuccess(
          sendTX({
            transactions: prepareTransactions,
            forceAtomic: true,
            mainActionLoadingText: loadingActionText,
            mainActionCompleteText,
            renderSuccessContent: GoToVault,
          }),
        );

        return success;
      },
      [activeVault?.dashboard, prepareReportCalls, sendTX, stETH, wstETH],
    ),
    ...rest,
  };
};
