import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  useVault,
  vaultTexts,
  GoToVault,
  useReportCalls,
  getStEthContract,
} from 'modules/vaults';
import {
  TransactionEntry,
  useLidoSDK,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

import { useLiability } from './use-liability';
import type { RepayFormValidatedValues } from '../types';

export const useRepay = () => {
  const { activeVault } = useVault();
  const { stETH, wstETH, publicClient } = useLidoSDK();
  const { data } = useLiability();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();
  const { liabilityShares } = data ?? {};

  return {
    burn: useCallback(
      async ({ amount, token }: RepayFormValidatedValues) => {
        invariant(activeVault, '[useRepay] activeVault is undefined');
        invariant(liabilityShares, '[useRepay] liabilityShares is undefined');
        invariant(publicClient, '[useRepay] publicClient is undefined');

        const loadingActionText = vaultTexts.actions.repay.loading(token);
        const mainActionCompleteText =
          vaultTexts.actions.repay.completed(token);

        const prepareTransactions = async () => {
          const calls: TransactionEntry[] = [...prepareReportCalls()];

          const isSteth = token === 'stETH';
          const tokenContract = isSteth ? stETH : wstETH;
          const stethContract = getStEthContract(publicClient);

          let txAmount = amount;
          if (isSteth) {
            const sharesAmount = await stethContract.read.getSharesByPooledEth([
              amount,
            ]);
            const diff = liabilityShares - sharesAmount;
            txAmount = diff === 1n ? sharesAmount + 1n : sharesAmount;
          }

          const allowance = await tokenContract.allowance({
            to: activeVault.dashboard.address,
          });
          const needsAllowance = allowance < txAmount;
          if (needsAllowance) {
            const approveCall = {
              ...(await tokenContract.populateApprove({
                amount: txAmount,
                to: activeVault.dashboard.address,
              })),
              loadingActionText: vaultTexts.actions.approve.loading(token),
            };
            calls.push(approveCall);
          }

          calls.push({
            ...activeVault.dashboard.encode[
              isSteth ? 'burnShares' : 'burnWstETH'
            ]([txAmount]),
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
      [
        activeVault,
        prepareReportCalls,
        sendTX,
        stETH,
        wstETH,
        liabilityShares,
        publicClient,
      ],
    ),
    ...rest,
  };
};
