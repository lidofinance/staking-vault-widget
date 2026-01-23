import { useCallback } from 'react';
import { useFormContext } from 'react-hook-form';

import {
  useVault,
  useVaultConfirmingRoles,
  useVaultTierInfo,
  vaultTexts,
} from 'modules/vaults';

import {
  useConfirmTierVoting,
  useTierVoting,
} from 'features/settings/tier/hooks';

import { ButtonStyled } from './styles';

const texts = vaultTexts.actions.tier;

export const ApproveRequest = () => {
  const {
    approveMovingTier,
    approveSyncTier,
    approveUpdateMintingLimit,
    approving,
  } = useConfirmTierVoting();
  const { refetch: refetchVault } = useVault();
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { reset: resetForm } = useFormContext();
  const tierVoting = useTierVoting();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const hasBothRoles = hasAdmin && isNodeOperator;
  const { proposal, isTheSameUser, proposedTier, isLiabilityOverLimit } =
    tierVoting ?? {};

  const handleApprove = useCallback(async () => {
    if (!proposal || !proposedTier || !vaultTierInfo) return;
    const { functionName } = proposal;

    if (functionName === 'changeTier') {
      await approveMovingTier();
    } else if (functionName === 'updateVaultShareLimit') {
      await approveUpdateMintingLimit();
    } else if (functionName === 'syncTier') {
      await approveSyncTier();
    }

    await refetchVault().then(() =>
      resetForm({
        selectedTierId: proposal.tierId.toString(),
        selectedTierLimit:
          proposedTier.shareLimitStETH - proposedTier.liabilityStETH,
        vaultMintingLimit:
          functionName !== 'syncTier'
            ? proposal.proposedVaultLimitStETH
            : vaultTierInfo.vault.stETHLimit,
      }),
    );
  }, [
    approveMovingTier,
    approveSyncTier,
    approveUpdateMintingLimit,
    refetchVault,
    proposal,
    proposedTier,
    resetForm,
    vaultTierInfo,
  ]);

  const approveButtonText = isLiabilityOverLimit
    ? texts.request.approveButton.capacityExceeded
    : texts.request.approveButton.approve;

  if (!proposal || !proposedTier || (!hasBothRoles && isTheSameUser))
    return null;

  return (
    <ButtonStyled
      onClick={handleApprove}
      disabled={isLiabilityOverLimit || approving}
      data-testid="approveButton"
    >
      {approveButtonText}
    </ButtonStyled>
  );
};
