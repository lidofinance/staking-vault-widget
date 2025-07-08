import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { useVaultOverviewData, VAULT_TOTAL_BASIS_POINTS } from 'modules/vaults';
import { formatBalance } from 'utils';

export const useStEthChart = (): LineData[] => {
  const { data: activeVault } = useVaultOverviewData();

  return useMemo(() => {
    if (!activeVault) return [];

    const {
      reserveRatioBP,
      forcedRebalanceThresholdBP,
      totalValue,
      totalMintingCapacityStETH,
    } = activeVault;

    const totalValueAmount = formatBalance(totalValue).trimmed;
    const reserveRatioAmount = formatBalance(
      (BigInt((reserveRatioBP * 100) / VAULT_TOTAL_BASIS_POINTS) * totalValue) /
        100n,
    ).trimmed;
    const forcedRebalanceThresholdAmount = formatBalance(
      (BigInt((forcedRebalanceThresholdBP * 100) / VAULT_TOTAL_BASIS_POINTS) *
        totalValue) /
        100n,
    ).trimmed;
    const totalMintingCapacityStETHAmount = formatBalance(
      totalMintingCapacityStETH,
    ).trimmed;

    return [
      {
        color: '#EC8600',
        labelPosition: 'top',
        threshold: {
          description: `Reserve Ratio ${reserveRatioAmount} stETH`,
          label: `${reserveRatioAmount} stETH`,
          value: parseFloat(reserveRatioAmount),
        },
      },
      {
        color: '#0085FF',
        labelPosition: 'top',
        threshold: {
          description: `Total stETH capacity ${totalMintingCapacityStETHAmount} stETH`,
          label: `${totalMintingCapacityStETHAmount} stETH`,
          value: parseFloat(totalMintingCapacityStETHAmount),
        },
      },
      {
        color: '#D74758',
        labelPosition: 'bottom',
        threshold: {
          description: `Forced Rebalance Threshold ${forcedRebalanceThresholdAmount} stETH`,
          label: `${forcedRebalanceThresholdAmount} stETH`,
          value: parseFloat(forcedRebalanceThresholdAmount),
        },
      },
      {
        color: '#7A8AA0',
        labelPosition: 'bottom',
        threshold: {
          description: `Total Value ${totalValueAmount} ETH`,
          label: `${totalValueAmount} ETH`,
          value: parseFloat(totalValueAmount),
        },
      },
    ] as LineData[];
  }, [activeVault]);
};
