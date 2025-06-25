import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo, vaultTexts, GoToVault } from 'modules/vaults';
import {
  TransactionEntry,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

import type { RepayFormValidatedValues } from '../types';

export const useRepay = () => {
  const { activeVault } = useVaultInfo();
  const { stETH, wstETH } = useLidoSDK();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    burn: useCallback(
      async ({ amount, token }: RepayFormValidatedValues) => {
        invariant(activeVault?.owner, '[useMint] owner is undefined');

        const loadingActionText = vaultTexts.actions.repay.loading(token);
        const mainActionCompleteText =
          vaultTexts.actions.repay.completed(token);

        const prepareTransactions = async () => {
          const calls: TransactionEntry[] = [];

          const isSteth = token === 'stETH';
          const tokenContract = isSteth ? stETH : wstETH;

          const allowance = await tokenContract.allowance({
            to: activeVault.owner,
          });
          const needsAllowance = allowance < amount;
          if (needsAllowance) {
            const approveCall = {
              ...(await tokenContract.populateApprove({
                amount,
                to: activeVault.owner,
              })),
              loadingActionText: vaultTexts.actions.approve.loading(token),
            };
            calls.push(approveCall);
          }
          calls.push({
            to: activeVault.owner,
            data: encodeFunctionData({
              abi: dashboardAbi,
              functionName: token === 'stETH' ? 'burnStETH' : 'burnWstETH',
              args: [amount],
            }),
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
      [activeVault?.owner, sendTX, stETH, wstETH],
    ),
    ...rest,
  };
};
