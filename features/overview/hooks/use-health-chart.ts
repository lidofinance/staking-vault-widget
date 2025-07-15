import { useMemo } from 'react';

import {
  VAULT_HEALTH_PERCENT_RED,
  VAULT_HEALTH_PERCENT_YELLOW,
  VAULT_HEALTH_PERCENT_GREEN,
  VAULT_HEALTH_PERCENT_HEALTH,
} from 'consts/threshold';

const PERCENT = 100;

const calculateHealthChart = (healthFactorNumber = 0) => {
  const rebalancePercent = Math.min(
    (healthFactorNumber / VAULT_HEALTH_PERCENT_RED) * PERCENT,
    PERCENT,
  );
  const dangerPercent = Math.min(
    Math.max(
      ((healthFactorNumber - VAULT_HEALTH_PERCENT_RED) /
        (VAULT_HEALTH_PERCENT_YELLOW - VAULT_HEALTH_PERCENT_RED)) *
        PERCENT,
      0,
    ),
    PERCENT,
  );
  const warningPercent = Math.min(
    Math.max(
      ((healthFactorNumber - VAULT_HEALTH_PERCENT_YELLOW) /
        (VAULT_HEALTH_PERCENT_GREEN - VAULT_HEALTH_PERCENT_YELLOW)) *
        PERCENT,
      0,
    ),
    PERCENT,
  );
  const successPercent = Math.min(
    Math.max(
      ((healthFactorNumber - VAULT_HEALTH_PERCENT_GREEN) /
        (VAULT_HEALTH_PERCENT_HEALTH - VAULT_HEALTH_PERCENT_GREEN)) *
        PERCENT,
      0,
    ),
    PERCENT,
  );

  const chartData = [
    {
      color: 'var(--chart-health-rebalance)',
      label: `${VAULT_HEALTH_PERCENT_RED}%`,
      progress: rebalancePercent,
      value: VAULT_HEALTH_PERCENT_RED,
    },
    {
      color: 'var(--chart-health-danger)',
      label: `${VAULT_HEALTH_PERCENT_YELLOW}%`,
      progress: dangerPercent,
      value: VAULT_HEALTH_PERCENT_YELLOW,
    },
    {
      color: 'var(--chart-health-warning)',
      label: `${VAULT_HEALTH_PERCENT_GREEN}%`,
      progress: warningPercent,
      value: VAULT_HEALTH_PERCENT_GREEN,
    },
    {
      color: 'var(--chart-health-success)',
      label: `${VAULT_HEALTH_PERCENT_HEALTH}%`,
      progress: successPercent,
      value: VAULT_HEALTH_PERCENT_HEALTH,
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

export const useHealthChart = (healthFactorNumber?: number) => {
  return useMemo(
    () => calculateHealthChart(healthFactorNumber),
    [healthFactorNumber],
  );
};
