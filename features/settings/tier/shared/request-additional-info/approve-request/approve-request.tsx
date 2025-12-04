import { useCallback } from 'react';

import { useNodeOperatorTiersInfo, useVaultTierInfo } from 'modules/vaults';

import {
  useConfirmTierVoting,
  useTierVoting,
} from 'features/settings/tier/hooks';

import { ButtonStyled } from './styles';

export const ApproveRequest = () => {
  const {
    approveMovingTier,
    approveSyncTier,
    approveUpdateMintingLimit,
    approving,
  } = useConfirmTierVoting();
  const tierVoting = useTierVoting();
  const { refetch } = useVaultTierInfo();
  const { refetch: refetchNOTiers } = useNodeOperatorTiersInfo();

  const { proposal, isTheSameUser, proposedTier } = tierVoting ?? {};

  const handleApprove = useCallback(async () => {
    if (!proposal || !proposedTier) return;
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

    await Promise.all([
      refetch({ cancelRefetch: true, throwOnError: false }),
      refetchNOTiers({ cancelRefetch: true, throwOnError: false }),
    ]);
  }, [
    approveMovingTier,
    approveSyncTier,
    approveUpdateMintingLimit,
    refetch,
    refetchNOTiers,
    proposal,
    proposedTier,
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
