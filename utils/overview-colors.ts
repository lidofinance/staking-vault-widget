import {
  VAULT_HEALTH_PERCENT_GREEN,
  VAULT_HEALTH_PERCENT_YELLOW,
  VAULT_HEALTH_PERCENT_RED,
} from 'consts/threshold';

export const getHealthFactorColor = (healthFactor?: string | number) => {
  if (typeof healthFactor === 'undefined') return '';
  let healthFactorNumber = 0;

  if (typeof healthFactor === 'string')
    healthFactorNumber = Number(healthFactor.split('%')[0]);
  else healthFactorNumber = healthFactor;

  if (healthFactorNumber >= VAULT_HEALTH_PERCENT_GREEN) return '#53BA95';
  if (healthFactorNumber >= VAULT_HEALTH_PERCENT_YELLOW) return '#ffbf00';
  if (healthFactorNumber >= VAULT_HEALTH_PERCENT_RED) return '#E14D4D';
  return 'darkRed';
};

export const getCarrySpreadColor = (carrySpread?: string) => {
  if (!carrySpread) return '';
  let carrySpreadNumber = 0;

  if (typeof carrySpread === 'string')
    carrySpreadNumber = Number(carrySpread.split('%')[0]);
  else carrySpreadNumber = carrySpread;

  if (carrySpreadNumber < 0) return 'darkRed';
  return '#53BA95';
};
