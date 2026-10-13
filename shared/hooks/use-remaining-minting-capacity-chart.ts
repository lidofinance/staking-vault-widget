import { useMemo } from 'react';
import { LineData } from '@lidofinance/lido-ui';

import { formatBalance, normalizeChartBN } from 'utils';
import {
  VAULT_TOTAL_BASIS_POINTS_BN,
  useVaultOverviewData,
} from 'modules/vaults';

type RemainingMintingCapacityChartParams = {
  mintableStETH: bigint;
  totalValue: bigint;
  reserveRatioBP: number;
  vaultLiability: bigint;
  forcedRebalanceThresholdBP: number;
};

export const getRemainingMintingCapacityChartData = ({
  mintableStETH,
  totalValue,
  reserveRatioBP,
  vaultLiability,
  forcedRebalanceThresholdBP,
}: RemainingMintingCapacityChartParams): LineData[] => {
  const totalValueETH = `${formatBalance(totalValue).trimmed} ETH`;
  const vaultLiabilityStETH = `${formatBalance(vaultLiability).trimmed} ETH`;
  const remainingMintingCapacity = mintableStETH + vaultLiability;
  const remainingMintingCapacityStETH = `${formatBalance(remainingMintingCapacity).trimmed} stETH`;
  const forcedRebalanceThreshold =
    totalValue -
    (totalValue / VAULT_TOTAL_BASIS_POINTS_BN) *
      BigInt(forcedRebalanceThresholdBP);
  const forcedRebalanceThresholdStETH = `${formatBalance(forcedRebalanceThreshold).trimmed} stETH`;
  const reserveRatio =
    totalValue -
    (totalValue / VAULT_TOTAL_BASIS_POINTS_BN) * BigInt(reserveRatioBP);
  const reserveRatioAmount = `${formatBalance(reserveRatio).trimmed} stETH`;

  return [
    {
      color: 'var(--lido-color-primary)',
      labelPosition: 'top',
      threshold: {
        description: `Minted ${vaultLiabilityStETH}`,
        color: 'transparent',
        label: `${vaultLiabilityStETH}`,
        value: normalizeChartBN(vaultLiability),
      },
    },
    {
      color: '#CCEDFF',
      labelPosition: 'top',
      threshold: {
        color: `var(--lido-color-primary)`,
        description: `Available for minting ${remainingMintingCapacityStETH}`,
        label: `${remainingMintingCapacityStETH}`,
        value: normalizeChartBN(remainingMintingCapacity),
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
      color: '#ECECEC',
      labelPosition: 'top',
      threshold: {
        color: 'var(--lido-color-error)',
        description: `Not available for minting ${forcedRebalanceThresholdStETH}`,
        label: `${forcedRebalanceThresholdStETH}`,
        value: normalizeChartBN(forcedRebalanceThreshold),
      },
    },
    {
      color: '#ECECEC',
      labelPosition: 'top',
      threshold: {
        color: 'transparent',
        description: `Total value ${totalValueETH}`,
        label: `${totalValueETH}`,
        value: normalizeChartBN(totalValue),
      },
    },
  ];
};

export const useRemainingMintingCapacityChart = () => {
  const { data } = useVaultOverviewData();

  return useMemo(() => {
    if (!data) return [];

    const {
      mintableStETH,
      totalValueETH: totalValue,
      reserveRatioBP,
      vaultLiabilityStETH: vaultLiability,
      forcedRebalanceThresholdBP,
    } = data;

    return getRemainingMintingCapacityChartData({
      mintableStETH,
      totalValue,
      reserveRatioBP,
      vaultLiability,
      forcedRebalanceThresholdBP,
    });
  }, [data]);
};
