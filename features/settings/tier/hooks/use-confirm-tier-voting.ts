import { useCallback, useState } from 'react';
import invariant from 'tiny-invariant';

import {
  useSendTransaction,
  withSuccess,
  type TransactionEntry,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  useReportCalls,
  useVaultConfirmingRoles,
  type Tier,
} from 'modules/vaults';
import { toStethValue } from 'utils';

export const useConfirmTierVoting = () => {
  const [approving, setApproving] = useState(false);
  const { activeVault } = useVault();
  const { isNodeOperator } = useVaultConfirmingRoles();
  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();

  const approveMovingTier = useCallback(
    async (
      tier: Tier,
      mintingLimitShares: bigint,
      mintingLimitStETH: bigint,
    ) => {
      invariant(
        activeVault,
        '[useConfirmTierVoting::approveMovingTier] activeVault is undefined',
      );

      setApproving(true);
      const { id } = tier;
      const transactions: TransactionEntry[] = [...prepareReportCalls()];
      const loadingActionText = vaultTexts.actions.settings.approveSelectedTier(
        id,
        mintingLimitStETH,
      );
      const mainActionCompleteText =
        vaultTexts.actions.settings.completeChangeTier(id, mintingLimitStETH);

      const mainActionCompleteDescriptionText = `Your request to move stVault to ${
        tier.tierName
      } with a ${toStethValue(
        mintingLimitStETH,
      )} minting limit has been approved successfully.`;

      const texts = {
        loadingActionText,
        baseDescriptionText: `You’re approving to move stVault to ${
          tier.tierName
        } with a ${toStethValue(mintingLimitStETH)} minting limit.`,
        awaitingDescriptionText: `stVault has been successfully moved to ${
          tier.tierName
        }, with a ${toStethValue(mintingLimitStETH)} minting limit applied.`,
      };

      // if node operator, use operator grid contract
      // if not node operator, use dashboard contract
      if (isNodeOperator) {
        transactions.push({
          ...activeVault.operatorGrid.encode.changeTier([
            activeVault.address,
            id,
            mintingLimitShares,
          ]),
          ...texts,
        });
      } else {
        transactions.push({
          ...activeVault.dashboard.encode.changeTier([id, mintingLimitShares]),
          ...texts,
        });
      }

      const result = await withSuccess(
        sendTX({
          transactions,
          mainActionCompleteText,
          mainActionLoadingText: loadingActionText,
          mainActionCompleteDescriptionText,
          allowRetry: false,
        }),
      );

      setApproving(false);

      return {
        result,
      };
    },
    [activeVault, sendTX, prepareReportCalls, isNodeOperator],
  );

  const approveUpdateMintingLimit = useCallback(
    async (
      tierId: bigint,
      mintingLimitShares: bigint,
      mintingLimitStETH: bigint,
    ) => {
      invariant(
        activeVault,
        '[useConfirmTierVoting::approveUpdateMintingLimit] activeVault is undefined',
      );

      setApproving(true);
      const transactions: TransactionEntry[] = [...prepareReportCalls()];
      const loadingActionText =
        vaultTexts.actions.settings.approveChangeTierMintingLimit(
          tierId,
          mintingLimitStETH,
        );
      const mainActionCompleteText =
        vaultTexts.actions.settings.completeChangeTierMintingLimit(
          tierId,
          mintingLimitStETH,
        );

      const mainActionCompleteDescriptionText = `Your request for new ${toStethValue(
        mintingLimitStETH,
      )} minting limit has been approved successfully.`;

      const texts = {
        loadingActionText,
        baseDescriptionText: `You’re approving to update stVault limit with ${toStethValue(
          mintingLimitStETH,
        )}.`,
        awaitingDescriptionText: `stVault has been successfully updated with a ${toStethValue(
          mintingLimitStETH,
        )} minting limit.`,
      };

      // if node operator, use operator grid contract
      // if not node operator, use dashboard contract
      if (isNodeOperator) {
        transactions.push({
          ...activeVault.operatorGrid.encode.updateVaultShareLimit([
            activeVault.address,
            mintingLimitShares,
          ]),
          ...texts,
        });
      } else {
        transactions.push({
          ...activeVault.dashboard.encode.updateShareLimit([
            mintingLimitShares,
          ]),
          ...texts,
        });
      }

      const result = await withSuccess(
        sendTX({
          transactions,
          mainActionCompleteText,
          mainActionLoadingText: loadingActionText,
          mainActionCompleteDescriptionText,
          allowRetry: false,
        }),
      );

      setApproving(false);

      return {
        result,
      };
    },
    [activeVault, sendTX, prepareReportCalls, isNodeOperator],
  );

  const approveSyncTier = useCallback(
    async (tier: Tier) => {
      invariant(
        activeVault,
        '[useConfirmTierVoting::approveSyncTier] activeVault is undefined',
      );

      setApproving(true);
      const transactions: TransactionEntry[] = [...prepareReportCalls()];
      const mainActionCompleteText =
        vaultTexts.actions.settings.completeSyncTier(tier.tierName);
      const loadingActionText = vaultTexts.actions.settings.syncTier(
        tier.tierName,
      );

      const mainActionCompleteDescriptionText = `Your request to sync stVault with ${tier.tierName} has been approved successfully.`;

      const texts = {
        loadingActionText,
        baseDescriptionText: `You’re approving sync stVault and ${tier.tierName} with a new params.`,
        awaitingDescriptionText: `stVault has been successfully synced with the ${tier.tierName}.`,
      };

      // if node operator, use operator grid contract
      // if not node operator, use dashboard contract
      if (isNodeOperator) {
        transactions.push({
          ...activeVault.operatorGrid.encode.syncTier([activeVault.address]),
          ...texts,
        });
      } else {
        transactions.push({
          ...activeVault.dashboard.encode.syncTier(),
          ...texts,
        });
      }

      const result = await withSuccess(
        sendTX({
          transactions,
          mainActionCompleteText,
          mainActionLoadingText: loadingActionText,
          mainActionCompleteDescriptionText,
          allowRetry: false,
        }),
      );

      setApproving(false);

      return {
        result,
      };
    },
    [activeVault, sendTX, prepareReportCalls, isNodeOperator],
  );

  return {
    approving,
    approveMovingTier,
    approveUpdateMintingLimit,
    approveSyncTier,
    ...rest,
  };
};
