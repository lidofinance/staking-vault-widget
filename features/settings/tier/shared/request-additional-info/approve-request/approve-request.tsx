import { useCallback } from 'react';
import { useAccount } from 'wagmi';

import {
  useVault,
  useVaultConfirmingRoles,
  useNodeOperatorTiersInfo,
  useVaultTierInfo,
} from 'modules/vaults';

import { useChangeTierRequest } from '../../../hooks';

import { ButtonStyled } from './styles';

export const ApproveRequest = () => {
  const { approveMovingTier, approving } = useChangeTierRequest();
  const { data: vaultTierInfo, refetch } = useVaultTierInfo();
  const { refetch: refetchNOTiers } = useNodeOperatorTiersInfo();
  const { address } = useAccount();
  const { activeVault } = useVault();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();

  const proposal = vaultTierInfo?.proposals.lastProposal;
  const hasAccessToApproving =
    !!address &&
    ((isNodeOperator && activeVault?.nodeOperator !== proposal?.member) ||
      hasAdmin);

  const handleApprove = useCallback(async () => {
    const [_, tierId, mintingLimit] = proposal?.decodedData.args ?? [];
    if (typeof tierId !== 'bigint' || typeof mintingLimit !== 'bigint') return;

    await approveMovingTier(tierId, mintingLimit);
    await Promise.all([
      refetch({ cancelRefetch: true, throwOnError: false }),
      refetchNOTiers({ cancelRefetch: true, throwOnError: false }),
    ]);
  }, [approveMovingTier, refetch, refetchNOTiers, proposal]);

  if (!proposal || !hasAccessToApproving) return null;

  return (
    <ButtonStyled onClick={handleApprove} disabled={approving}>
      Approve
    </ButtonStyled>
  );
};
