import { useCallback } from 'react';
import type { Address } from 'viem';
import invariant from 'tiny-invariant';

import { useVault, vaultTexts } from 'modules/vaults';
import {
  type TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

const { loading, completed } = vaultTexts.actions.disconnectVault.withdraw;

type WithdrawBalanceArgs = {
  recipient: Address;
  amount: bigint;
};

export const useWithdrawBalance = () => {
  const { activeVault, invalidateVaultState } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  const withdrawBalance = useCallback(
    async ({ recipient, amount }: WithdrawBalanceArgs) => {
      invariant(activeVault, '[useWithdrawBalance] activeVault is undefined');

      // the Dashboard is abandoned at this step, so we call the vault directly
      const calls: TransactionEntry[] = [
        {
          ...activeVault.vault.encode.withdraw([recipient, amount]),
          loadingActionText: loading,
        },
      ];

      const { success } = await withSuccess(
        sendTX({
          transactions: calls,
          mainActionLoadingText: loading,
          mainActionCompleteText: completed,
        }),
      );

      if (success) await invalidateVaultState();

      return success;
    },
    [activeVault, invalidateVaultState, sendTX],
  );

  return {
    withdrawBalance,
    ...rest,
  };
};
