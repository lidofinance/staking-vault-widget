import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import {
  useVault,
  vaultTexts,
  GoToVault,
  useReportCalls,
} from 'modules/vaults';
import {
  type TransactionEntry,
  useDappStatus,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useDisableForm } from 'shared/hook-form';
import { WEI_PER_GWEI } from 'consts/tx';

import type { WithdrawalFormValidatedValues } from '../types';

const { loadingText, mainCompleteText } =
  vaultTexts.actions.validators.modals.withdrawal.txModal;

export const useWithdrawalToVault = () => {
  const { activeVault } = useVault();
  const disabled = useDisableForm();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();
  const { address } = useDappStatus();

  const withdrawToVault = useCallback(
    async ({ amount, index, pubkey }: WithdrawalFormValidatedValues) => {
      invariant(activeVault, '[useWithdrawalToVault] activeVault is undefined');
      invariant(
        !disabled,
        '[useWithdrawalToVault] form has been disabled for any transactions',
      );
      invariant(
        address,
        '[useWithdrawalToVault] fee recipient address is undefined',
      );

      const amountInGwei = amount / WEI_PER_GWEI;

      const mainActionLoadingText = loadingText(index, amount);
      const mainActionCompleteText = mainCompleteText(index, amount);

      const prepareTransactions = async () => {
        const calls: TransactionEntry[] = [...prepareReportCalls()];

        calls.push({
          ...activeVault.dashboard.encode.triggerValidatorWithdrawals([
            pubkey,
            [amountInGwei],
            address,
          ]),
          loadingActionText: mainActionLoadingText,
        });
        return calls;
      };

      const { success } = await withSuccess(
        sendTX({
          transactions: prepareTransactions,
          forceAtomic: true,
          mainActionLoadingText,
          mainActionCompleteText,
          renderSuccessContent: GoToVault,
        }),
      );

      return success;
    },
    [activeVault, prepareReportCalls, sendTX, disabled, address],
  );

  return {
    withdrawToVault,
    ...rest,
  };
};
