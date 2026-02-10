import { config } from 'config';
import type { Address } from 'viem';

import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { appPaths } from 'consts/routing';

import type { VaultRoutesConfig, NavigationRoutes } from './types';

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
  '/vaults/[vaultAddress]/disburse': MATOMO_CLICK_EVENTS_TYPES.clickNaviNOFee,
  '/vaults/[vaultAddress]/settings/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviSettings,
};

export const vaultRoutes = (
  vaultAddress: Address | '[vaultAddress]',
  config?: VaultRoutesConfig,
): NavigationRoutes[] => {
  const { mode } = config ?? {};

  return [
    {
      title: 'Overview',
      path: appPaths.vaults.vault(vaultAddress).overview,
      icon: 'mosaic',
      exact: true,
      inMobileMenu: false,
    },
    {
      title: 'Supply/Withdraw',
      path: appPaths.vaults.vault(vaultAddress).eth(mode ?? 'supply'),
      icon: 'stake',
      exact: true,
      inMobileMenu: false,
    },
    {
      title: 'Mint/Repay stETH',
      path: appPaths.vaults.vault(vaultAddress).steth(mode ?? 'mint'),
      icon: 'mint',
      exact: true,
      inMobileMenu: true,
    },
    {
      title: 'Validators',
      path: getValidatorsLink(),
      icon: 'validators',
      exact: true,
      external: true,
      inMobileMenu: true,
    },
    {
      title: 'Node Operator fee',
      path: appPaths.vaults.vault(vaultAddress).disburse,
      icon: 'withdraw',
      exact: true,
      inMobileMenu: true,
    },
    {
      title: 'Settings',
      path: appPaths.vaults.vault(vaultAddress).settings(mode ?? 'main'),
      icon: 'gear',
      exact: true,
      inMobileMenu: true,
    },
  ];
};

export const vaultPathnames = vaultRoutes('[vaultAddress]', {
  mode: '[mode]',
}).map((routes) => ({ ...routes }));
