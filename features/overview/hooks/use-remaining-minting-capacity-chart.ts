import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { formatBalance } from 'utils';
import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';

import { useVaultOverview } from 'features/overview/contexts';

export const useRemainingMintingCapacityChart = () => {
  const {
    isLoadingVault,
    values: {
      mintableStETH,
      totalValue,
      vaultLiability,
      forcedRebalanceThresholdBP,
    },
  } = useVaultOverview();

  return useMemo(() => {
    if (isLoadingVault) return [];

    const totalValueETH = `${formatBalance(totalValue).trimmed} ETH`;
    const vaultLiabilityStETH = `${formatBalance(vaultLiability).trimmed} ETH`;
    const remainingMintingCapacity = mintableStETH + vaultLiability;
    const remainingMintingCapacityStETH = `${formatBalance(remainingMintingCapacity).trimmed} stETH`;
    const forcedRebalanceThreshold =
      totalValue -
      (totalValue / VAULT_TOTAL_BASIS_POINTS_BN) *
        BigInt(forcedRebalanceThresholdBP);
    const forcedRebalanceThresholdStETH = `${formatBalance(forcedRebalanceThreshold).trimmed} stETH`;

    return [
      {
        color: 'var(--lido-color-primary)',
        labelPosition: 'top',
        threshold: {
          description: `Minted ${vaultLiabilityStETH}`,
          color: 'transparent',
          label: `${vaultLiabilityStETH}`,
          value: Number(vaultLiability),
        },
      },
      {
        color:
          'color-mix(in display-p3, var(--lido-color-primary) 20%, transparent)',
        labelPosition: 'top',
        threshold: {
          color: `var(--lido-color-primary)`,
          description: `Available for minting ${remainingMintingCapacityStETH}`,
          label: `${remainingMintingCapacityStETH}`,
          value: Number(remainingMintingCapacity),
        },
      },
      {
        color: '#13121714',
        labelPosition: 'top',
        threshold: {
          color: 'var(--lido-color-error)',
          description: `Not available for minting ${forcedRebalanceThresholdStETH}`,
          label: `${forcedRebalanceThresholdStETH}`,
          value: Number(forcedRebalanceThreshold),
        },
      },
      {
        color: '#13121714',
        labelPosition: 'top',
        threshold: {
          color: 'transparent',
          description: `Total value ${totalValueETH}`,
          label: `${totalValueETH}`,
          value: Number(totalValue),
        },
      },
    ] as LineData[];
  }, [
    isLoadingVault,
    mintableStETH,
    vaultLiability,
    totalValue,
    forcedRebalanceThresholdBP,
  ]);
};
