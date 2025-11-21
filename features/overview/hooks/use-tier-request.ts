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

    let proposedTierId = proposal?.decodedData.args[1];
    if (typeof proposedTierId !== 'bigint') {
      proposedTierId = 0n;
    }

    const proposedTier = noTiersInfo.tiers.find(
      (tier) => tier.id === proposedTierId,
    );

    if (!proposedTier) {
      return {};
    }

    let proposedVaultLimitStETH = proposals.proposedVaultLimitStETH;
    if (typeof proposedVaultLimitStETH !== 'bigint') {
      proposedVaultLimitStETH =
        proposedTier.shareLimitStETH - proposedTier.liabilityStETH;
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
