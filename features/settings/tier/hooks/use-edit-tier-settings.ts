import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVault, vaultTexts, GoToVault } from 'modules/vaults';
import { TierSettingsFormValues } from '../types';
import { useVaultTierInfo } from './use-vault-tier-info';

export const useEditTierSettings = () => {
  const { activeVault } = useVault();
  const { data: tierInfo } = useVaultTierInfo();

  const { sendTX, ...rest } = useSendTransaction();

  return {
    editTierSettings: useCallback(
      async (formValues: TierSettingsFormValues) => {
        invariant(tierInfo, '[useEditTierSettings] tierInfo is undefined');
        invariant(
          activeVault,
          '[useEditTierSettings] activeVault is undefined',
        );

        const transactions: TransactionEntry[] = [];
        const { selectedTierId, vaultMintingLimit } = formValues;

        if (selectedTierId) {
          transactions.push({
            ...activeVault.operatorGrid.encode.changeTier([
              activeVault.address,
              BigInt(selectedTierId),
              BigInt(vaultMintingLimit),
            ]),
            loadingActionText: vaultTexts.actions.settings.confirmSelectedTier(
              selectedTierId,
              '10,000 stETH', // TODO: REPLACE by tier minting limit
            ),
          });
        }

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `Requesting to move to Tier ${tierInfo}`,
            mainActionCompleteText: `Request for Tier ${tierInfo} submitted`,
            renderSuccessContent: GoToVault,
            allowRetry: false,
          }),
        );

        return {
          result,
        };
      },
      [tierInfo, activeVault, sendTX],
    ),
    ...rest,
  };
};
