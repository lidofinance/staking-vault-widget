import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';
import { formatBalance } from 'utils';

import { useVaultOverview } from 'features/overview/contexts';

export const useStEthChart = (): LineData[] => {
  const {
    isLoadingVault,
    values: {
      forcedRebalanceThresholdBP,
      totalValue,
      totalMintingCapacity,
      reserveRatioBP,
    },
  } = useVaultOverview();

  return useMemo(() => {
    if (isLoadingVault) return [];

    const totalValueETH = `${formatBalance(totalValue).trimmed} ETH`;
    const forcedRebalanceThreshold =
      totalValue -
      (totalValue / VAULT_TOTAL_BASIS_POINTS_BN) *
        BigInt(forcedRebalanceThresholdBP);
    const forcedRebalanceThresholdStETH = `${formatBalance(forcedRebalanceThreshold).trimmed} stETH`;

    const reserveRatio =
      totalValue -
      (totalValue / VAULT_TOTAL_BASIS_POINTS_BN) * BigInt(reserveRatioBP);
    const reserveRatioAmount = `${formatBalance(reserveRatio).trimmed} stETH`;
    const totalMintingCapacityStETH = `${formatBalance(totalMintingCapacity).trimmed} stETH`;

    return [
      {
        color: '#EC8600',
        labelPosition: 'top',
        threshold: {
          description: `Reserve Ratio ${reserveRatioAmount}`,
          label: `${reserveRatioAmount}`,
          value: Number(reserveRatio),
        },
      },
      {
        color: '#0085FF',
        labelPosition: 'top',
        threshold: {
          description: `Total stETH capacity ${totalMintingCapacityStETH}`,
          label: `${totalMintingCapacityStETH}`,
          value: Number(totalMintingCapacity),
        },
      },
      {
        color: '#D74758',
        labelPosition: 'bottom',
        threshold: {
          description: `Forced Rebalance Threshold ${forcedRebalanceThresholdStETH}`,
          label: `${forcedRebalanceThresholdStETH} stETH`,
          value: Number(forcedRebalanceThreshold),
        },
      },
      {
        color: '#7A8AA0',
        labelPosition: 'bottom',
        threshold: {
          description: `Total Value ${totalValueETH}`,
          label: `${totalValueETH}`,
          value: Number(totalValue),
        },
      },
    ] as LineData[];
  }, [
    forcedRebalanceThresholdBP,
    isLoadingVault,
    reserveRatioBP,
    totalMintingCapacity,
    totalValue,
  ]);
};
