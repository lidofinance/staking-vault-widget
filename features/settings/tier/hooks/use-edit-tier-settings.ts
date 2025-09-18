import invariant from 'tiny-invariant';
import { useCallback } from 'react';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  useVaultConfirmingRoles,
  useVaultTierInfo,
  useNodeOperatorTiersInfo,
} from 'modules/vaults';
import { toStethValue } from 'utils';
import { useLidoSDK } from 'modules/web3';

import type { TierSettingsFormValues } from '../types';

export const useEditTierSettings = () => {
  const { activeVault } = useVault();
  const { data: tierInfo } = useVaultTierInfo();
  const { data: nodeOperatorTiers } = useNodeOperatorTiersInfo();
  const { sendTX, ...rest } = useSendTransaction();
  const { shares } = useLidoSDK();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();

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

        const bothRequestingRoles = isNodeOperator && hasAdmin;

        const nodeOperatorRequest = {
          ...activeVault.operatorGrid.encode.changeTier([
            activeVault.address,
            BigInt(selectedTierId),
            mintingLimitInShares,
          ]),
          loadingActionText: vaultTexts.actions.settings.confirmSelectedTier(
            selectedTierId,
            toStethValue(vaultMintingLimit),
          ),
        };

        const defaultAdminRequest = {
          ...activeVault.dashboard.encode.changeTier([
            BigInt(selectedTierId),
            mintingLimitInShares,
          ]),
          loadingActionText: vaultTexts.actions.settings.confirmSelectedTier(
            selectedTierId,
            toStethValue(vaultMintingLimit),
          ),
        };

        // if node operator, use operator grid contract
        // if not node operator, use dashboard contract
        if (bothRequestingRoles) {
          transactions.push(nodeOperatorRequest, defaultAdminRequest);
        } else if (isNodeOperator) {
          transactions.push(nodeOperatorRequest);
        } else {
          transactions.push(defaultAdminRequest);
        }

        const loadingText = bothRequestingRoles ? 'Approving' : 'Requesting';
        const completeText = bothRequestingRoles ? 'Approve' : 'Request';

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `${loadingText} to move to ${selectedTier.tierName}`,
            mainActionCompleteText: `${completeText} for ${selectedTier.tierName} submitted`,
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
        nodeOperatorTiers?.tiers,
        shares,
        sendTX,
        hasAdmin,
        isNodeOperator,
      ],
    ),
    ...rest,
  };
};
