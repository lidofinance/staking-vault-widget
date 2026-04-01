import { FC } from 'react';
import { Question, Tooltip } from '@lidofinance/lido-ui';

import {
  getMintingConstraintType,
  isBigint,
  MintingConstraintType,
} from 'utils';
import { useNodeOperatorTiersInfo, useVaultTierInfo } from 'modules/vaults';

type MintingCapacityTooltipProps = {
  tierId: bigint | undefined;
};

const texts: Record<MintingConstraintType, string> = {
  minimalReserve: 'Constrained by Minimal reserve',
  reserveRatio: 'Constrained by Reserve ratio',
  vault: 'Constrained by Total stVaults remaining capacity',
  tier: 'Constrained by Tier remaining capacity',
  group: 'Constrained by Node Operator remaining capacity',
  lido: 'Constrained by stVault minting limit',
};

export const MintingCapacityTooltip: FC<MintingCapacityTooltipProps> = ({
  tierId,
}) => {
  const { data: vaultTierInfo } = useVaultTierInfo();
  const { data: noTiersInfo } = useNodeOperatorTiersInfo();

  if (!vaultTierInfo || !noTiersInfo || !isBigint(tierId)) return null;

  const selectedTier = noTiersInfo.tiers.find((tier) => tier.id === tierId);
  if (!selectedTier) return null;

  const mintingConstraintBy = getMintingConstraintType({
    collateral: vaultTierInfo.collateral,
    minimalReserve: vaultTierInfo.minimalReserve,
    totalMintingCapacityShares: vaultTierInfo.vault.totalMintingCapacityShares,
    vaultShareLimit: vaultTierInfo.vault.shareLimit,
    tierShareLimit: selectedTier.shareLimit,
    groupShareLimit: noTiersInfo.group.shareLimit,
    lidoTVLSharesLimit: vaultTierInfo.lidoTVLSharesLimit,
    totalValue: vaultTierInfo.vault.totalValue,
    tierId,
  });

  return (
    <Tooltip title={texts[mintingConstraintBy]}>
      <Question />
    </Tooltip>
  );
};
