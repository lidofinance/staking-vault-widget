import { useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';

import {
  useVault,
  useVaultConfirmingRoles,
  useNodeOperatorTiersInfo,
  useVaultTierInfo,
  useVaultPermission,
} from 'modules/vaults';

import { useChangeTierRequest } from 'features/settings/tier/hooks';
import { checkUserIsProposer } from 'features/settings/tier/const';

import { ButtonStyled } from './styles';

export const ApproveRequest = () => {
  const { approveMovingTier, approving } = useChangeTierRequest();
  const { data: vaultTierInfo, refetch } = useVaultTierInfo();
  const { refetch: refetchNOTiers } = useNodeOperatorTiersInfo();
  const { address } = useAccount();
  const { activeVault } = useVault();
  const { hasAdmin, isNodeOperator } = useVaultConfirmingRoles();
  const { hasPermission: hasVaultConfigurationPermission } =
    useVaultPermission('vaultConfiguration');

  const proposal = vaultTierInfo?.proposals.lastProposal;
  const hasAccessToApproving =
    !!address &&
    ((isNodeOperator && activeVault?.nodeOperator !== proposal?.member) ||
      (hasVaultConfigurationPermission &&
        activeVault?.nodeOperator === proposal?.member) ||
      hasAdmin);

  const [isDashboardProposer, isNOProposer] = useMemo(() => {
    const isDashboardProposer = checkUserIsProposer(
      activeVault?.owner,
      proposal?.member,
    );

    const isNOProposer = checkUserIsProposer(
      activeVault?.nodeOperator,
      proposal?.member,
    );

    return [isDashboardProposer, isNOProposer];
  }, [activeVault, proposal?.member]);

  const handleApprove = useCallback(async () => {
    const [_, tierId, mintingLimit] = proposal?.decodedData.args ?? [];
    if (typeof tierId !== 'bigint' || typeof mintingLimit !== 'bigint') return;

    await approveMovingTier(tierId, mintingLimit);
    await Promise.all([
      refetch({ cancelRefetch: true, throwOnError: false }),
      refetchNOTiers({ cancelRefetch: true, throwOnError: false }),
    ]);
  }, [approveMovingTier, refetch, refetchNOTiers, proposal]);

  if (
    !proposal ||
    !hasAccessToApproving ||
    (hasAdmin && isDashboardProposer) ||
    (isNodeOperator && isNOProposer)
  )
    return null;

  return (
    <ButtonStyled onClick={handleApprove} disabled={approving}>
      Approve
    </ButtonStyled>
  );
};
