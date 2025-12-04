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
    const isTheSameUser =
      isAddressEqual(proposer, address) ||
      (isAddressEqual(proposer, activeVault.dashboard.address) &&
        (hasVaultConfigurationPermission || hasAdmin));

    return { proposal, proposedTier, isTheSameUser };
  }, [
    activeVault,
    vaultTierInfo,
    noTiersInfo,
    address,
    hasVaultConfigurationPermission,
    hasAdmin,
  ]);
};
