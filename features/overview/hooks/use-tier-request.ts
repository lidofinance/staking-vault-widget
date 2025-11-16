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
    if (!proposal) {
      return {};
    }

    const proposedTierId = proposal.decodedData.args[1];
    const proposedVaultLimitStETH = proposals.proposedVaultLimitStETH;
    const proposedTier = noTiersInfo.tiers.find(
      (tier) => tier.id === proposedTierId,
    );

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
