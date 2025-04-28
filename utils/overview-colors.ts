import {
  VAULT_HEALTH_PERCENT_GREEN,
  VAULT_HEALTH_PERCENT_YELLOW,
  VAULT_HEALTH_PERCENT_RED,
  VAULT_UTILIZATION_RATIO_GREEN,
  VAULT_UTILIZATION_RATIO_RED,
} from 'consts/threshold';

export const getHealthFactorColor = (healthFactor: string | number) => {
  if (!healthFactor) return '';
  let healthFactorNumber = 0;

  if (typeof healthFactor === 'string')
    healthFactorNumber = Number(healthFactor.split('%')[0]);
  else healthFactorNumber = healthFactor;

  if (healthFactorNumber >= VAULT_HEALTH_PERCENT_GREEN) return '#53BA95';
  if (healthFactorNumber >= VAULT_HEALTH_PERCENT_YELLOW) return '#ffbf00';
  if (healthFactorNumber >= VAULT_HEALTH_PERCENT_RED) return '#E14D4D';
  return 'darkRed';
};

export const getUtilizationRatioColor = (utilizationRatio: string) => {
  if (!utilizationRatio) return '';
  let utilizationRatioNumber = 0;

  if (typeof utilizationRatio === 'string')
    utilizationRatioNumber = Number(utilizationRatio.split('%')[0]);
  else utilizationRatioNumber = utilizationRatio;

  if (utilizationRatioNumber < VAULT_UTILIZATION_RATIO_GREEN) return '#53BA95';
  if (utilizationRatioNumber < VAULT_UTILIZATION_RATIO_RED) return '#ffbf00';
  if (utilizationRatioNumber === VAULT_UTILIZATION_RATIO_RED) return '#E14D4D';
  if (utilizationRatioNumber > VAULT_UTILIZATION_RATIO_RED) return 'darkRed';
};
