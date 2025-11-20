import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { GoToVault, useVault, vaultTexts } from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

import { useTierRequest } from './use-tier-request';
import { dataToTx } from '../content/connect-vault/utils';

export const useConnectVault = () => {
  const { activeVault, refetch: refetchVault } = useVault();
  const { sendTX, ...rest } = useSendTransaction();
  const { proposedTier, proposedVaultLimitShares } = useTierRequest();

  return {
    connectVault: useCallback(async () => {
      invariant(activeVault, '[useConnectVault] activeVault is not defined');

      const { data, value } = dataToTx(proposedTier, proposedVaultLimitShares);

      const tx = {
        to: activeVault.vaultOwner,
        data,
        value,
        loadingActionText: vaultTexts.actions.connectVault.connect,
      };

      const success = await withSuccess(
        sendTX({
          transactions: [tx],
          mainActionCompleteText: vaultTexts.actions.connectVault.completed,
          mainActionLoadingText: vaultTexts.actions.connectVault.connect,
          renderSuccessContent: GoToVault,
        }),
      );

      await refetchVault({ cancelRefetch: true, throwOnError: false });
      return success;
    }, [
      activeVault,
      sendTX,
      proposedVaultLimitShares,
      proposedTier,
      refetchVault,
    ]),
    ...rest,
  };
};
