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
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useDisableForm } from 'shared/hook-form';

import { useValidators } from 'features/validators/contexts';

import { WithdrawalFormValidatedValues } from '../types';
const { loadingText, mainCompleteText } =
  vaultTexts.actions.validators.modals.withdrawal.txModal;

export const useWithdrawalToVault = () => {
  const { activeVault } = useVault();
  const disabled = useDisableForm();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();
  const { feeRecipient } = useValidators();

  const withdrawToVault = useCallback(
    async ({ amount, index, pubkey }: WithdrawalFormValidatedValues) => {
      invariant(activeVault, '[useWithdrawalToVault] activeVault is undefined');
      invariant(
        !disabled,
        '[useWithdrawalToVault] form has been disabled for any transactions',
      );
      invariant(
        feeRecipient,
        '[useWithdrawalToVault] fee recipient is undefined',
      );

      const mainActionLoadingText = loadingText(index, amount);
      const mainActionCompleteText = mainCompleteText(index, amount);

      const prepareTransactions = async () => {
        const calls: TransactionEntry[] = [...prepareReportCalls()];

        // TODO format amount from wei to gwei
        calls.push({
          ...activeVault.dashboard.encode.triggerValidatorWithdrawals([
            pubkey,
            [amount],
            feeRecipient,
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
    [activeVault, prepareReportCalls, sendTX, disabled, feeRecipient],
  );

  return {
    withdrawToVault,
    ...rest,
  };
};
