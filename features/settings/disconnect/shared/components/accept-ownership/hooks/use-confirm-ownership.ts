import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { useVault, vaultTexts } from 'modules/vaults';
import {
  type TransactionEntry,
  useDappStatus,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';

const { loading, completeActionText } =
  vaultTexts.actions.disconnectVault.acceptOwnership;

export const useConfirmOwnership = () => {
  const { address } = useDappStatus();
  const { activeVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    acceptOwnership: useCallback(async () => {
      invariant(activeVault, '[useConfirmOwnership] activeVault is undefined');
      invariant(address, '[useConfirmOwnership] address is undefined');

      const acceptOwnership: TransactionEntry[] = [
        {
          ...activeVault.vault.encode.acceptOwnership(),
          loadingActionText: loading(address),
        },
      ];

      const { success } = await withSuccess(
        sendTX({
          transactions: acceptOwnership,
          mainActionLoadingText: loading(address),
          mainActionCompleteText: completeActionText(address),
        }),
      );

      return success;
    }, [activeVault, address, sendTX]),
    ...rest,
  };
};
