import { useCallback } from 'react';
import invariant from 'tiny-invariant';

import { GoToVault, useVault, vaultTexts } from 'modules/vaults';
import { useSendTransaction, withSuccess } from 'modules/web3';

import { useTierRequest } from './use-tier-request';
import { dataToTx } from '../content/connect-vault/utils';

export const useConnectVault = () => {
  const { activeVault } = useVault();
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

      return await withSuccess(
        sendTX({
          transactions: [tx],
          mainActionCompleteText: vaultTexts.actions.connectVault.completed,
          mainActionLoadingText: vaultTexts.actions.connectVault.connect,
          renderSuccessContent: GoToVault,
        }),
      );
    }, [activeVault, sendTX, proposedVaultLimitShares, proposedTier]),
    ...rest,
  };
};
