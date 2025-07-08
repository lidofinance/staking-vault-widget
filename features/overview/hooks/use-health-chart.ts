import { useMemo } from 'react';
import {
  HEALTH_REBALANCE_BP,
  HEALTH_DANGER_BP,
  HEALTH_WARNING_BP,
  HEALTH_SUCCESS_BP,
} from 'features/overview/consts';

const PERCENT = 100;

const calculateHealthChart = (healthFactorNumber = 0) => {
  const rebalancePercent = Math.min(
    (healthFactorNumber / HEALTH_REBALANCE_BP) * PERCENT,
    PERCENT,
  );
  const dangerPercent = Math.min(
    Math.max(
      ((healthFactorNumber - HEALTH_REBALANCE_BP) /
        (HEALTH_DANGER_BP - HEALTH_REBALANCE_BP)) *
        PERCENT,
      0,
    ),
    PERCENT,
  );
  const warningPercent = Math.min(
    Math.max(
      ((healthFactorNumber - HEALTH_DANGER_BP) /
        (HEALTH_WARNING_BP - HEALTH_DANGER_BP)) *
        PERCENT,
      0,
    ),
    PERCENT,
  );
  const successPercent = Math.min(
    Math.max(
      ((healthFactorNumber - HEALTH_WARNING_BP) /
        (HEALTH_SUCCESS_BP - HEALTH_WARNING_BP)) *
        PERCENT,
      0,
    ),
    PERCENT,
  );

  const chartData = [
    {
      color: 'var(--chart-health-rebalance)',
      label: `${HEALTH_REBALANCE_BP}%`,
      progress: rebalancePercent,
      value: HEALTH_REBALANCE_BP,
    },
    {
      color: 'var(--chart-health-danger)',
      label: `${HEALTH_DANGER_BP}%`,
      progress: dangerPercent,
      value: HEALTH_DANGER_BP,
    },
    {
      color: 'var(--chart-health-warning)',
      label: `${HEALTH_WARNING_BP}%`,
      progress: warningPercent,
      value: HEALTH_WARNING_BP,
    },
    {
      color: 'var(--chart-health-success)',
      label: `${HEALTH_SUCCESS_BP}%`,
      progress: successPercent,
      value: HEALTH_SUCCESS_BP,
    },
  ];

  return {
    chartData,
    rebalancePercent,
    dangerPercent,
    warningPercent,
    successPercent,
  };
};

export const useHealthChart = (healthFactorNumber: number) => {
  return useMemo(
    () => calculateHealthChart(healthFactorNumber),
    [healthFactorNumber],
  );
};
