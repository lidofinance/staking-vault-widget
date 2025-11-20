import { useMemo } from 'react';

import { useNodeOperatorTiersInfo, useVaultTierInfo } from 'modules/vaults';
import { calculateTierMetrics } from 'utils';

export const useTierRequest = () => {
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();

  return useMemo(() => {
    if (!vaultTierInfo || !noTiersInfo) {
      return {};
    }

    const proposals = vaultTierInfo.proposals;
    const proposal = proposals?.lastProposal;
    let proposedTierId = 0n;
    const defaultTier = noTiersInfo.tiers.find(
      (tier) => tier.id === proposedTierId,
    );
    let proposedTier = { ...defaultTier };
    let proposedVaultLimitStETH =
      defaultTier.shareLimitStETH - defaultTier.liabilityStETH;

    if (proposal) {
      proposedTierId = proposal.decodedData.args[1];
      proposedVaultLimitStETH = proposals.proposedVaultLimitStETH;
      proposedTier = noTiersInfo.tiers.find(
        (tier) => tier.id === proposedTierId,
      );
    }

    if (!proposedTier) {
      return {};
    }

    return {
      metrics: calculateTierMetrics({
        newTier: proposedTier,
        vault: vaultTierInfo.vault,
        newVaultMintingLimit: proposedVaultLimitStETH,
      }),
      proposedTier,
      proposedVaultLimitStETH,
      proposedVaultLimitShares: proposals.proposedVaultLimit,
    };
  }, [vaultTierInfo, noTiersInfo]);
};
