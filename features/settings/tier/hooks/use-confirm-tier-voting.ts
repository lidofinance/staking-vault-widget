import invariant from 'tiny-invariant';
import { useCallback, useState } from 'react';

import {
  useSendTransaction,
  withSuccess,
  type TransactionEntry,
} from 'modules/web3';
import {
  useVault,
  vaultTexts,
  GoToVault,
  useReportCalls,
  useVaultConfirmingRoles,
  type Tier,
} from 'modules/vaults';

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

      // if node operator, use operator grid contract
      // if not node operator, use dashboard contract
      if (isNodeOperator) {
        transactions.push({
          ...activeVault.operatorGrid.encode.changeTier([
            activeVault.address,
            id,
            mintingLimitShares,
          ]),
          loadingActionText,
        });
      } else {
        transactions.push({
          ...activeVault.dashboard.encode.changeTier([id, mintingLimitShares]),
          loadingActionText,
        });
      }

      const result = await withSuccess(
        sendTX({
          transactions,
          mainActionCompleteText,
          mainActionLoadingText: loadingActionText,
          renderSuccessContent: GoToVault,
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

      // if node operator, use operator grid contract
      // if not node operator, use dashboard contract
      if (isNodeOperator) {
        transactions.push({
          ...activeVault.operatorGrid.encode.updateVaultShareLimit([
            activeVault.address,
            mintingLimitShares,
          ]),
          loadingActionText,
        });
      } else {
        transactions.push({
          ...activeVault.dashboard.encode.updateShareLimit([
            mintingLimitShares,
          ]),
          loadingActionText,
        });
      }

      const result = await withSuccess(
        sendTX({
          transactions,
          mainActionCompleteText,
          mainActionLoadingText: loadingActionText,
          renderSuccessContent: GoToVault,
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
        vaultTexts.actions.settings.completeSyncTier(tier.id);
      const loadingActionText = vaultTexts.actions.settings.syncTier(tier.id);

      // if node operator, use operator grid contract
      // if not node operator, use dashboard contract
      if (isNodeOperator) {
        transactions.push({
          ...activeVault.operatorGrid.encode.syncTier([activeVault.address]),
          loadingActionText,
        });
      } else {
        transactions.push({
          ...activeVault.dashboard.encode.syncTier(),
          loadingActionText,
        });
      }

      const result = await withSuccess(
        sendTX({
          transactions,
          mainActionCompleteText,
          mainActionLoadingText: loadingActionText,
          renderSuccessContent: GoToVault,
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
