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
} from 'modules/vaults';
import { toStethValue } from 'utils';

import { useTierVoting } from './use-tier-voting';

export const useConfirmTierVoting = () => {
  const [approving, setApproving] = useState(false);
  const { activeVault } = useVault();
  const { isNodeOperator } = useVaultConfirmingRoles();
  const prepareReportCalls = useReportCalls();
  const { sendTX, ...rest } = useSendTransaction();
  const tierVoting = useTierVoting();

  const approveMovingTier = useCallback(async () => {
    invariant(
      activeVault,
      '[useConfirmTierVoting::approveMovingTier] activeVault is undefined',
    );
    invariant(
      tierVoting,
      '[useConfirmTierVoting::approveMovingTier] tierVoting is undefined',
    );

    const { proposal, proposedTier: tier, createdByAdminOrRole } = tierVoting;

    invariant(
      tier,
      '[useConfirmTierVoting::approveMovingTier] tier is undefined',
    );

    const {
      proposedVaultLimitShares: mintingLimitShares,
      proposedVaultLimitStETH: mintingLimitStETH,
    } = proposal;

    invariant(
      mintingLimitShares,
      '[useConfirmTierVoting::approveMovingTier] mintingLimitShares is undefined',
    );
    invariant(
      mintingLimitStETH,
      '[useConfirmTierVoting::approveMovingTier] mintingLimitStETH is undefined',
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

    const mainActionCompleteDescriptionText = `stVault has been successfully moved to ${
      tier.tierName
    }, with a ${toStethValue(mintingLimitStETH)} minting limit applied.`;

    const texts = {
      loadingActionText,
      baseDescriptionText: `You’re approving to move stVault to ${
        tier.tierName
      } with a ${toStethValue(mintingLimitStETH)} minting limit.`,
      awaitingDescriptionText:
        'Waiting for block confirmation for your request. This may take a few moments.',
    };

    // if node operator, use operator grid contract
    // if not node operator, use dashboard contract
    if (isNodeOperator && createdByAdminOrRole) {
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
  }, [activeVault, sendTX, prepareReportCalls, isNodeOperator, tierVoting]);

  const approveUpdateMintingLimit = useCallback(async () => {
    invariant(
      activeVault,
      '[useConfirmTierVoting::approveUpdateMintingLimit] activeVault is undefined',
    );
    invariant(
      tierVoting,
      '[useConfirmTierVoting::approveUpdateMintingLimit] tierVoting is undefined',
    );

    const { proposal, createdByAdminOrRole } = tierVoting;
    const {
      proposedVaultLimitShares: mintingLimitShares,
      proposedVaultLimitStETH: mintingLimitStETH,
    } = proposal;

    invariant(
      mintingLimitShares,
      '[useConfirmTierVoting::approveUpdateMintingLimit] mintingLimitShares is undefined',
    );
    invariant(
      mintingLimitStETH,
      '[useConfirmTierVoting::approveUpdateMintingLimit] mintingLimitStETH is undefined',
    );

    setApproving(true);
    const transactions: TransactionEntry[] = [...prepareReportCalls()];
    const loadingActionText =
      vaultTexts.actions.settings.approveChangeTierMintingLimit;
    const mainActionCompleteText =
      vaultTexts.actions.settings.completeChangeTierMintingLimit;

    const mainActionCompleteDescriptionText = `Your request for new ${toStethValue(
      mintingLimitStETH,
    )} minting limit has been approved successfully.`;

    const texts = {
      loadingActionText,
      baseDescriptionText: `You’re approving to update stVault limit with ${toStethValue(
        mintingLimitStETH,
      )}.`,
      awaitingDescriptionText:
        'Waiting for block confirmation for your request. This may take a few moments.',
    };

    // if node operator, use operator grid contract
    // if not node operator, use dashboard contract
    if (isNodeOperator && createdByAdminOrRole) {
      transactions.push({
        ...activeVault.operatorGrid.encode.updateVaultShareLimit([
          activeVault.address,
          mintingLimitShares,
        ]),
        ...texts,
      });
    } else {
      transactions.push({
        ...activeVault.dashboard.encode.updateShareLimit([mintingLimitShares]),
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
  }, [activeVault, sendTX, prepareReportCalls, isNodeOperator, tierVoting]);

  const approveSyncTier = useCallback(async () => {
    invariant(
      activeVault,
      '[useConfirmTierVoting::approveSyncTier] activeVault is undefined',
    );
    invariant(
      tierVoting,
      '[useConfirmTierVoting::approveSyncTier] tierVoting is undefined',
    );

    const { proposedTier: tier, createdByAdminOrRole } = tierVoting;

    invariant(
      tier,
      '[useConfirmTierVoting::approveSyncTier] tier is undefined',
    );

    setApproving(true);
    const transactions: TransactionEntry[] = [...prepareReportCalls()];
    const mainActionCompleteText = vaultTexts.actions.settings.completeSyncTier(
      tier.tierName,
    );
    const loadingActionText = vaultTexts.actions.settings.syncTier(
      tier.tierName,
    );

    const mainActionCompleteDescriptionText = `stVault has been successfully synced with the ${tier.tierName}..`;

    const texts = {
      loadingActionText,
      baseDescriptionText: `You’re approving sync stVault and ${tier.tierName} with a new params.`,
      awaitingDescriptionText:
        'Waiting for block confirmation for your request. This may take a few moments.',
    };

    // if node operator, use operator grid contract
    // if not node operator, use dashboard contract
    if (isNodeOperator && createdByAdminOrRole) {
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
  }, [activeVault, sendTX, prepareReportCalls, isNodeOperator, tierVoting]);

  return {
    approving,
    approveMovingTier,
    approveUpdateMintingLimit,
    approveSyncTier,
    ...rest,
  };
};
