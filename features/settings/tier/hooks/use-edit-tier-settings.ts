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
  useVaultConfirmingRoles,
  useVaultTierInfo,
  useNodeOperatorTiersInfo,
  useReportCalls,
  useVaultPermission,
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
  const { hasPermission } = useVaultPermission('vaultConfiguration');

  return {
    editTierSettings: useCallback(
      async (formValues: TierSettingsFormValues) => {
        invariant(tierInfo, '[useEditTierSettings] tierInfo is undefined');
        invariant(
          activeVault,
          '[useEditTierSettings] activeVault is undefined',
        );

        const transactions: TransactionEntry[] = [...prepareReportCalls()];
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

        const bothRequestingRoles =
          isNodeOperator && (hasAdmin || hasPermission);
        const isUpdatingVaultShareLimit =
          BigInt(selectedTierId) === tierInfo.vault.tierId;

        if (isUpdatingVaultShareLimit) {
          const texts = {
            loadingActionText:
              vaultTexts.actions.settings.requestUpdateVaultShareLimitTitle,
            baseDescriptionText:
              vaultTexts.actions.settings.requestUpdateVaultShareLimitDescription(
                toStethValue(vaultMintingLimit),
              ),
            awaitingDescriptionText:
              vaultTexts.actions.settings.awaitingRequestUpdateVaultShareLimit,
          };

          const nodeOperatorUpdateLimitRequest = {
            ...activeVault.operatorGrid.encode.updateVaultShareLimit([
              activeVault.address,
              mintingLimitInShares,
            ]),
            ...texts,
          };

          const roleOrAdminUpdateLimitRequest = {
            ...activeVault.dashboard.encode.updateShareLimit([
              mintingLimitInShares,
            ]),
            ...texts,
          };

          if (isNodeOperator) {
            transactions.push(nodeOperatorUpdateLimitRequest);
          }

          if (hasAdmin || hasPermission) {
            transactions.push(roleOrAdminUpdateLimitRequest);
          }
        } else {
          const texts = {
            loadingActionText: vaultTexts.actions.settings.confirmSelectedTier(
              selectedTierId,
              toStethValue(vaultMintingLimit),
            ),
          };

          const nodeOperatorChangeTierRequest = {
            ...activeVault.operatorGrid.encode.changeTier([
              activeVault.address,
              BigInt(selectedTierId),
              mintingLimitInShares,
            ]),
            ...texts,
          };

          const defaultAdminRequest = {
            ...activeVault.dashboard.encode.changeTier([
              BigInt(selectedTierId),
              mintingLimitInShares,
            ]),
            ...texts,
          };

          // if node operator, use operator grid contract
          // if not node operator, use dashboard contract
          if (isNodeOperator) {
            transactions.push(nodeOperatorChangeTierRequest);
          }

          if (hasAdmin || hasPermission) {
            transactions.push(defaultAdminRequest);
          }
        }

        const loadingTextHead = bothRequestingRoles
          ? 'Approving'
          : 'Requesting';
        const loadingTextBody = isUpdatingVaultShareLimit
          ? `to change vault minting limit with ${toStethValue(vaultMintingLimit)}`
          : `to move to ${selectedTier.tierName}`;

        const completeTextBody = isUpdatingVaultShareLimit
          ? 'New minting limit request'
          : `Request for ${selectedTier.tierName}`;
        const completeTextTail = bothRequestingRoles ? 'approved' : 'submitted';

        const mainActionCompleteDescriptionText = isUpdatingVaultShareLimit
          ? `Your request for new ${toStethValue(vaultMintingLimit)} minting limit has been submitted successfully. It is now pending confirmation from the ${isNodeOperator ? 'Vault Owner or the Role with permission' : 'Node Operator'}.`
          : `Your request to move stVault to ${selectedTier.tierName} with a ${toStethValue(vaultMintingLimit)} minting limit has been submitted successfully. It is now pending confirmation from the ${isNodeOperator ? 'Vault Owner or the Role with permission' : 'Node Operator'}.`;

        const result = await withSuccess(
          sendTX({
            transactions,
            mainActionLoadingText: `${loadingTextHead} ${loadingTextBody}`,
            mainActionCompleteText: `${completeTextBody} ${completeTextTail}`,
            mainActionCompleteDescriptionText,
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
        hasPermission,
      ],
    ),
    ...rest,
  };
};
