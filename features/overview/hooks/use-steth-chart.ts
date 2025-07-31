import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { VAULT_TOTAL_BASIS_POINTS_BN } from 'modules/vaults';
import { formatBalance } from 'utils';

import { useVaultOverview } from 'features/overview/vault-overview';
import { normalizeChartBN } from './utils';

export const useStEthChart = (): LineData[] => {
  const { values } = useVaultOverview();

  return useMemo(() => {
    if (!values) return [];

    const {
      vaultLiability,
      forcedRebalanceThresholdBP,
      totalValue,
      totalMintingCapacity,
      reserveRatioBP,
    } = values;

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
        color: 'var(--lido-color-primary)',
        labelPosition: 'top',
        threshold: {
          color: 'transparent',
          value: normalizeChartBN(vaultLiability),
        },
      },
      {
        labelPosition: 'top',
        color: '#CCEDFF',
        threshold: {
          color: 'var(--lido-color-primary)',
          description: `Total stETH capacity ${totalMintingCapacityStETH}`,
          label: `${totalMintingCapacityStETH}`,
          value: normalizeChartBN(totalMintingCapacity),
        },
      },
      {
        labelPosition: 'top',
        threshold: {
          color: '#EC8600',
          description: `Reserve Ratio ${reserveRatioAmount}`,
          label: `${reserveRatioAmount}`,
          value: normalizeChartBN(reserveRatio),
        },
      },

      {
        labelPosition: 'bottom',
        threshold: {
          color: '#D74758',
          description: `Forced Rebalance Threshold ${forcedRebalanceThresholdStETH}`,
          label: `${forcedRebalanceThresholdStETH} stETH`,
          value: normalizeChartBN(forcedRebalanceThreshold),
        },
      },
      {
        labelPosition: 'bottom',
        threshold: {
          color: '#7A8AA0',
          description: `Total Value ${totalValueETH}`,
          label: `${totalValueETH}`,
          value: normalizeChartBN(totalValue),
        },
      },
    ] as LineData[];
  }, [values]);
};
