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

import { useLiability } from './use-liability';
import type { RepayFormValidatedValues } from '../types';

export const useRepay = () => {
  const { activeVault } = useVault();
  const { stETH, wstETH, shares } = useLidoSDK();
  const { data } = useLiability();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();
  const { liabilityShares } = data ?? {};

  return {
    burn: useCallback(
      async ({ amount, token }: RepayFormValidatedValues) => {
        invariant(activeVault, '[useRepay] activeVault is undefined');
        invariant(liabilityShares, '[useRepay] liabilityShares is undefined');

        const loadingActionText = vaultTexts.actions.repay.loading(token);
        const mainActionCompleteText =
          vaultTexts.actions.repay.completed(token);

        const prepareTransactions = async () => {
          const calls: TransactionEntry[] = [...prepareReportCalls()];

          const isSteth = token === 'stETH';
          const tokenContract = isSteth ? stETH : wstETH;

          let txAmount = amount;
          if (isSteth) {
            const sharesAmount = await shares.convertToShares(amount);

            // Corner case when a user burns max stETH amount and conversion can return 1 wei less
            // liabilityShares => stETH for repay form (with round up), max stETH => sharesAmount
            txAmount =
              liabilityShares - sharesAmount === 1n
                ? liabilityShares
                : sharesAmount;
          }

          const allowance = await tokenContract.allowance({
            to: activeVault.dashboard.address,
          });

          const needsAllowance = allowance < amount;
          if (needsAllowance) {
            const approveCall = {
              ...(await tokenContract.populateApprove({
                amount: amount,
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
        shares,
      ],
    ),
    ...rest,
  };
};
