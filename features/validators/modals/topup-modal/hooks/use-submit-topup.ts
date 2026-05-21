import { useCallback } from 'react';
import invariant from 'tiny-invariant';

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
import { ONE_GWEI } from 'consts/tx';

import type { TopUpFormValidatedValues } from '../types';

const { loadingText, mainCompleteText } =
  vaultTexts.actions.validators.modals.topUp.txModal;

export const useSubmitTopup = () => {
  const { activeVault } = useVault();
  const disabled = useDisableForm();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();

  return {
    topUp: useCallback(
      async ({ amount, index, pubkey }: TopUpFormValidatedValues) => {
        invariant(activeVault, '[useSubmitTopup] activeVault is undefined');
        invariant(
          !disabled,
          '[useSubmitTopup] form has been disabled for any transactions',
        );

        // @notice min amount === 1 ETH
        // amount is result of rounds eth down using gwei
        const amountInGwei = (amount / ONE_GWEI) * ONE_GWEI;

        const mainActionLoadingText = loadingText(index, amountInGwei);
        const mainActionCompleteText = mainCompleteText(index, amountInGwei);

        const prepareTransactions = async () => {
          const calls: TransactionEntry[] = [...prepareReportCalls()];

          calls.push({
            ...activeVault.predepositGuarantee.encode.topUpExistingValidators([
              [{ pubkey, amount: amountInGwei }],
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
      [activeVault, prepareReportCalls, sendTX, disabled],
    ),
    ...rest,
  };
};
