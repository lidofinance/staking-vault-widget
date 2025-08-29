import { useCallback } from 'react';

import { useChangeTierRequest, useVaultTierInfo } from '../../../hooks';

import { ButtonStyled } from './styles';
import { useAccount } from 'wagmi';
import {
  useVault,
  useVaultConfirmingRoles,
} from '../../../../../../modules/vaults';

export const ApproveRequest = () => {
  const { approveMovingTier, approving } = useChangeTierRequest();
  const { data: vaultTierInfo, refetch } = useVaultTierInfo();
  const { address } = useAccount();
  const { activeVault } = useVault();
  const { hasConfirmingRole } = useVaultConfirmingRoles();

  const proposal = vaultTierInfo?.proposals.lastProposal;
  const hasAccessToApproving =
    activeVault?.nodeOperator === address ||
    hasConfirmingRole ||
    proposal?.member?.toLowerCase() !== address?.toLowerCase();

  const handleApprove = useCallback(async () => {
    const [_, tierId, mintingLimit] = proposal?.decodedData.args ?? [];
    if (typeof tierId !== 'bigint' || typeof mintingLimit !== 'bigint') return;

    await approveMovingTier(tierId, mintingLimit);
    await refetch();
  }, [approveMovingTier, refetch, proposal]);

  if (!proposal || !hasAccessToApproving) return null;

  return (
    <ButtonStyled onClick={handleApprove} disabled={approving}>
      Approve
    </ButtonStyled>
  );
};
