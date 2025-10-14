import { FC } from 'react';
import { Question, Tooltip } from '@lidofinance/lido-ui';

import { getMintingConstraintType, MintingConstraintType } from 'utils';
import { useNodeOperatorTiersInfo, useVaultTierInfo } from 'modules/vaults';

type MintingCapacityTooltipProps = {
  tierId: bigint | undefined;
};

const texts: Record<MintingConstraintType, string> = {
  reserveRatio: 'Constrained by Reserve ratio',
  vault: 'Constrained by total stVaults remaining capacity',
  tier: 'Constrained by tier remaining capacity',
  group: 'Constrained by node operator remaining capacity',
  lido: 'Constrained by stVault minting limit',
};

export const MintingCapacityTooltip: FC<MintingCapacityTooltipProps> = ({
  tierId,
}) => {
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();

  if (!vaultTierInfo || !noTiersInfo || typeof tierId !== 'bigint') return null;

  const selectedTier = noTiersInfo.tiers.find((tier) => tier.id === tierId);
  if (!selectedTier) return null;

  const mintingConstraintBy = getMintingConstraintType({
    totalMintingCapacityShares: vaultTierInfo.vault.totalMintingCapacityShares,
    vaultShareLimit: vaultTierInfo.vault.shareLimit,
    tierShareLimit: selectedTier.shareLimit,
    groupShareLimit: noTiersInfo.group.shareLimit,
    lidoTVLSharesLimit: vaultTierInfo.lidoTVLSharesLimit,
    tierId,
  });

  return (
    <Tooltip title={texts[mintingConstraintBy]}>
      <Question />
    </Tooltip>
  );
};
