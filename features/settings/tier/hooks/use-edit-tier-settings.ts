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
  useReportCalls,
} from 'modules/vaults';
import { toStethValue } from 'utils';
import { useLidoSDK } from 'modules/web3';

import type { TierSettingsFormValues } from '../types';

export const useEditTierSettings = () => {
  const { activeVault } = useVault();
  const { data: tierInfo } = useVaultTierInfo();
  const { data: nodeOperatorTiers } = useNodeOperatorTiersInfo();
  const { sendTX, ...rest } = useSendTransaction();
  const prepareReportCalls = useReportCalls();
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
        const isUpdatingVaultShareLimit =
          BigInt(selectedTierId) === tierInfo.vault.tierId;

        if (isUpdatingVaultShareLimit) {
          const loadingActionText =
            vaultTexts.actions.settings.confirmUpdateVaultShareLimit(
              toStethValue(vaultMintingLimit),
            );

          if (isNodeOperator) {
            transactions.push({
              ...activeVault.operatorGrid.encode.updateVaultShareLimit([
                activeVault.address,
                mintingLimitInShares,
              ]),
              loadingActionText,
            });
          } else {
            transactions.push({
              ...activeVault.dashboard.encode.updateShareLimit([
                mintingLimitInShares,
              ]),
              loadingActionText,
            });
          }
        } else {
          const nodeOperatorChangeTierRequest = {
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
            transactions.push(
              ...prepareReportCalls(),
              nodeOperatorChangeTierRequest,
              defaultAdminRequest,
            );
          } else if (isNodeOperator) {
            transactions.push(nodeOperatorChangeTierRequest);
          } else {
            transactions.push(defaultAdminRequest);
          }
        }

        const loadingTextHead = bothRequestingRoles
          ? 'Approving'
          : 'Requesting';
        const loadingTextBody = isUpdatingVaultShareLimit
          ? `to change vault minting limit with ${toStethValue(vaultMintingLimit)}`
          : `to move to ${selectedTier.tierName}`;
        const completeTextHead = bothRequestingRoles ? 'Approve' : 'Request';
        const completeTextBody = isUpdatingVaultShareLimit
          ? 'updating minting limit for vault'
          : `${selectedTier.tierName}`;

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `${loadingTextHead} ${loadingTextBody}`,
            mainActionCompleteText: `${completeTextHead} for ${completeTextBody} submitted`,
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
        prepareReportCalls,
      ],
    ),
    ...rest,
  };
};
