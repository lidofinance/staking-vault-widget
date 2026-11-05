import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { isAddressEqual } from 'viem';

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
  useDappStatus,
} from 'modules/web3';

import type { WithdrawFormValidatedValues } from '../types';

export const useWithdraw = () => {
  const { activeVault } = useVault();
  const { publicClient } = useLidoSDK();
  const { address } = useDappStatus();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  const withdraw = useCallback(
    async ({ amount, recipient, token }: WithdrawFormValidatedValues) => {
      invariant(activeVault, '[useWithdraw] activeVault is undefined');

      const calls: TransactionEntry[] = [];
      // Set when the wETH flow ends with a transfer to a third-party recipient.
      // On non-batched wallets the steps are mined one by one, so a whole-form
      // retry after a failed transfer would repeat the completed withdraw.
      let hasTransferStep = false;

      if (token === 'wETH') {
        // WETH.deposit credits msg.sender, i.e. the connected wallet, not the
        // withdraw recipient. So ETH is withdrawn to the caller, wrapped there,
        // and the WETH is then transferred to the recipient if they differ.
        invariant(address, '[useWithdraw] account address is undefined');
        const wethContract = getWethContract(publicClient);

        calls.push(
          {
            ...activeVault.dashboard.encode.withdraw([address, amount]),
            loadingActionText: vaultTexts.actions.withdraw.loading,
          },
          {
            ...wethContract.encode.deposit({ value: amount }),
            loadingActionText: vaultTexts.actions.weth.loadingWrap,
          },
        );

        if (!isAddressEqual(recipient, address)) {
          hasTransferStep = true;
          calls.push({
            ...wethContract.encode.transfer([recipient, amount]),
            loadingActionText: vaultTexts.actions.weth.loadingTransfer,
          });
        }
      } else {
        calls.push({
          ...activeVault.dashboard.encode.withdraw([recipient, amount]),
          loadingActionText: vaultTexts.actions.withdraw.loading,
        });
      }

      const { success } = await withSuccess(
        sendTX({
          transactions: async () => [...(await prepareReportCalls()), ...calls],
          forceAtomic: true,
          allowRetry: !hasTransferStep,
          mainActionLoadingText: vaultTexts.actions.withdraw.loading,
          mainActionCompleteText: vaultTexts.actions.withdraw.completed(token),
          renderSuccessContent: GoToVault,
        }),
      );

      return success;
    },
    [activeVault, address, publicClient, prepareReportCalls, sendTX],
  );

  return {
    withdraw,
    ...rest,
  };
};
