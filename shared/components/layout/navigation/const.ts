import { config } from 'config';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const validators: Record<number, string> = {
  [1]: 'https://beaconcha.in/validators/deposits?q=',
  [560048]: 'https://hoodi.beaconcha.in/validators/deposits?q=',
};

export const getValidatorsLink = (): string => {
  return validators[config.defaultChain];
};

export const routsClickEventsMap: Record<string, MATOMO_CLICK_EVENTS_TYPES> = {
  '/': MATOMO_CLICK_EVENTS_TYPES.clickNaviMyVaults,
  '/vaults': MATOMO_CLICK_EVENTS_TYPES.clickNaviAllVaults,
  '/vaults/[vaultAddress]': MATOMO_CLICK_EVENTS_TYPES.clickNaviOverview,
  '/vaults/[vaultAddress]/eth/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviSupplyWithdraw,
  '/vaults/[vaultAddress]/steth/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviMintRepayStETH,
  'https://hoodi.beaconcha.in/validators/deposits?q=':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviValidators,
  '/vaults/[vaultAddress]/claim': MATOMO_CLICK_EVENTS_TYPES.clickNaviNOFee,
  '/vaults/[vaultAddress]/settings/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviSettings,
};
