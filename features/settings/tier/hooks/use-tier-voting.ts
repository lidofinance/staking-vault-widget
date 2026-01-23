import { useMemo } from 'react';
import { useAccount } from 'wagmi';
import { isAddressEqual } from 'viem';

import {
  useVaultTierInfo,
  useNodeOperatorTiersInfo,
  useVault,
  useVaultPermission,
  useVaultConfirmingRoles,
} from 'modules/vaults';

export const useTierVoting = () => {
  const { activeVault } = useVault();
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { hasPermission: hasVaultConfigurationPermission } =
    useVaultPermission('vaultConfiguration');
  const { hasAdmin } = useVaultConfirmingRoles();
  const { address } = useAccount();

  return useMemo(() => {
    if (!activeVault || !vaultTierInfo || !noTiersInfo || !address) {
      return null;
    }

    const proposal = vaultTierInfo.proposals.extendLastProposal;
    if (!proposal) {
      return null;
    }

    const { member: proposer, tierId } = proposal;
    const proposedTier = noTiersInfo.tiers.find((tier) => tier.id === tierId);
    const createdByNodeOperator = isAddressEqual(proposer, address);
    const createdByAdminOrRole = isAddressEqual(proposer, activeVault.owner);
    const isTheSameUser =
      createdByNodeOperator ||
      (createdByAdminOrRole && (hasVaultConfigurationPermission || hasAdmin));

    const vaultLiabilityStETH = vaultTierInfo.vault.liabilityStETH;
    const availableLimitStETH =
      proposedTier.shareLimitStETH - proposedTier.liabilityStETH;
    const isLiabilityOverLimit = vaultLiabilityStETH > availableLimitStETH;

    return {
      proposal,
      proposedTier,
      isTheSameUser,
      createdByNodeOperator,
      createdByAdminOrRole,
      isLiabilityOverLimit,
    };
  }, [
    activeVault,
    vaultTierInfo,
    noTiersInfo,
    address,
    hasVaultConfigurationPermission,
    hasAdmin,
  ]);
};
