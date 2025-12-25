import { useCallback } from 'react';

import { useVault, useVaultTierInfo } from 'modules/vaults';

import {
  useConfirmTierVoting,
  useTierVoting,
} from 'features/settings/tier/hooks';

import { ButtonStyled } from './styles';
import { useFormContext } from 'react-hook-form';

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

  const { proposal, isTheSameUser, proposedTier } = tierVoting ?? {};

  const handleApprove = useCallback(async () => {
    if (!proposal || !proposedTier || !vaultTierInfo) return;
    const { functionName, proposedVaultLimitShares, proposedVaultLimitStETH } =
      proposal;

    if (functionName === 'changeTier') {
      await approveMovingTier(
        proposedTier,
        proposedVaultLimitShares,
        proposedVaultLimitStETH,
      );
    } else if (functionName === 'updateVaultShareLimit') {
      await approveUpdateMintingLimit(
        proposedTier.id,
        proposedVaultLimitShares,
        proposedVaultLimitStETH,
      );
    } else if (functionName === 'syncTier') {
      await approveSyncTier(proposedTier);
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

  if (!proposal || !proposedTier || isTheSameUser) return null;

  return (
    <ButtonStyled
      onClick={handleApprove}
      disabled={approving}
      data-testid="approveButton"
    >
      Approve
    </ButtonStyled>
  );
};
