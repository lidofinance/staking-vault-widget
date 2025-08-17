import invariant from 'tiny-invariant';
import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { useVault, vaultTexts, GoToVault } from 'modules/vaults';
import { toStethValue } from 'utils';
import { useLidoSDK } from 'modules/web3';

import { TierSettingsFormValues } from '../types';
import { useVaultTierInfo } from './use-vault-tier-info';
import { useNodeOperatorTiersInfo } from './use-no-tiers';

export const useEditTierSettings = () => {
  const { activeVault } = useVault();
  const { data: tierInfo } = useVaultTierInfo();
  const { data: nodeOperatorTiers } = useNodeOperatorTiersInfo();
  const { sendTX, ...rest } = useSendTransaction();
  const { shares } = useLidoSDK();
  const { address } = useAccount();

  return {
    editTierSettings: useCallback(
      async (formValues: TierSettingsFormValues) => {
        invariant(tierInfo, '[useEditTierSettings] tierInfo is undefined');
        invariant(
          activeVault,
          '[useEditTierSettings] activeVault is undefined',
        );

        const isNodeOperator = activeVault.nodeOperator === address;
        const transactions: TransactionEntry[] = [];
        const { selectedTierId, vaultMintingLimit } = formValues;

        const selectedTier = nodeOperatorTiers?.tiers?.find(
          (tier) => tier.id.toString() === selectedTierId,
        );

        invariant(
          selectedTier,
          '[useEditTierSettings] selectedTier is undefined',
        );

        const mintingLimitInShares =
          vaultMintingLimit === selectedTier.shareLimitStETH
            ? selectedTier.shareLimit
            : await shares.convertToShares(BigInt(vaultMintingLimit));

        // if node operator, use operator grid contract
        // if not node operator, use dashboard contract
        if (isNodeOperator) {
          transactions.push({
            ...activeVault.operatorGrid.encode.changeTier([
              activeVault.address,
              BigInt(selectedTierId),
              mintingLimitInShares,
            ]),
            loadingActionText: vaultTexts.actions.settings.confirmSelectedTier(
              selectedTierId,
              toStethValue(vaultMintingLimit),
            ),
          });
        } else {
          transactions.push({
            ...activeVault.dashboard.encode.changeTier([
              BigInt(selectedTierId),
              mintingLimitInShares,
            ]),
            loadingActionText: vaultTexts.actions.settings.confirmSelectedTier(
              selectedTierId,
              toStethValue(vaultMintingLimit),
            ),
          });
        }

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `Requesting to move to ${tierInfo.tier.tierName}`,
            mainActionCompleteText: `Request for ${tierInfo.tier.tierName} submitted`,
            renderSuccessContent: GoToVault,
            allowRetry: false,
          }),
        );

        return {
          result,
        };
      },
      [
        tierInfo,
        activeVault,
        address,
        nodeOperatorTiers?.tiers,
        shares,
        sendTX,
      ],
    ),
    ...rest,
  };
};
