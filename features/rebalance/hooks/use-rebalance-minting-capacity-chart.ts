import { useMemo } from 'react';
import type { LineData } from '@lidofinance/lido-ui';

import { getRemainingMintingCapacityChartData } from 'shared/hooks';
import { useRebalanceProjectedOverview } from './use-rebalance-projected-overview';
import { useRebalanceState } from './use-rebalance-state';

export const useRebalanceMintingCapacityChart = (): LineData[] => {
  const { data, projected } = useRebalanceProjectedOverview();
  const { hasFormErrors } = useRebalanceState();

  return useMemo(() => {
    if (!data) return [];

    const source =
      projected && !hasFormErrors
        ? {
            mintableStETH: projected.mintableStETH,
            totalValue: projected.totalValue,
            vaultLiability: projected.vaultLiability,
          }
        : {
            mintableStETH: data.mintableStETH,
            totalValue: data.totalValueETH,
            vaultLiability: data.vaultLiabilityStETH,
          };

    return getRemainingMintingCapacityChartData({
      ...source,
      reserveRatioBP: data.reserveRatioBP,
      forcedRebalanceThresholdBP: data.forcedRebalanceThresholdBP,
    });
  }, [data, projected, hasFormErrors]);
};
