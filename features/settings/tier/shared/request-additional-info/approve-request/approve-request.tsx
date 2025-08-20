import { useCallback } from 'react';

import { useChangeTierRequest, useVaultTierInfo } from '../../../hooks';

import { ButtonStyled } from './styles';

export const ApproveRequest = () => {
  const { approveMovingTier, approving } = useChangeTierRequest();
  const { data: vaultTierInfo } = useVaultTierInfo();

  const proposal = vaultTierInfo?.proposals.lastProposal;

  const handleApprove = useCallback(async () => {
    const [_, tierId, mintingLimit] = proposal?.decodedData.args ?? [];
    if (typeof tierId !== 'bigint' || typeof mintingLimit !== 'bigint') return;

    await approveMovingTier(tierId, mintingLimit);
  }, [approveMovingTier, proposal]);

  if (!proposal) return null;

  return (
    <ButtonStyled onClick={handleApprove} disabled={approving}>
      Approve
    </ButtonStyled>
  );
};
