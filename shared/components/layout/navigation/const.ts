import type { Address } from 'viem';

import { config } from 'config';
import { FEEDBACK_SURVEY_URL } from 'consts/external-links';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';
import { appPaths } from 'consts/routing';

import type { VaultRoutesConfig, NavigationRoutes, DocsLink } from './types';

export const routsClickEventsMap: Record<string, MATOMO_CLICK_EVENTS_TYPES> = {
  '/': MATOMO_CLICK_EVENTS_TYPES.clickNaviMyVaults,
  '/vaults': MATOMO_CLICK_EVENTS_TYPES.clickNaviAllVaults,
  '/vaults/[vaultAddress]': MATOMO_CLICK_EVENTS_TYPES.clickNaviOverview,
  '/vaults/[vaultAddress]/eth/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviSupplyWithdraw,
  '/vaults/[vaultAddress]/steth/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviMintRepayStETH,
  '/vaults/[vaultAddress]/validators':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviValidators,
  '/vaults/[vaultAddress]/disburse': MATOMO_CLICK_EVENTS_TYPES.clickNaviNOFee,
  '/vaults/[vaultAddress]/settings/[mode]':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviSettings,
  '/vaults/[vaultAddress]/rebalance':
    MATOMO_CLICK_EVENTS_TYPES.clickNaviRebalance,
};

export const vaultRoutes = (
  vaultAddress: Address | '[vaultAddress]',
  routesConfig?: VaultRoutesConfig,
): NavigationRoutes[] => {
  const { mode } = routesConfig ?? {};

  return [
    {
      title: 'Overview',
      path: appPaths.vaults.vault(vaultAddress).overview,
      icon: 'mosaic',
      exact: true,
      inMobileMenu: false,
    },
    {
      title: 'Supply/Withdraw ETH',
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
      path: appPaths.vaults.vault(vaultAddress).validators,
      icon: 'validators',
      exact: true,
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
      title: 'Rebalance',
      path: appPaths.vaults.vault(vaultAddress).rebalance,
      icon: 'rebalance',
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

export const homeRoutes: NavigationRoutes[] = [
  {
    title: 'My stVaults',
    path: appPaths.myVaults,
    icon: 'folder',
    exact: true,
  },
  {
    title: 'All stVaults',
    path: appPaths.vaults.all,
    icon: 'globe',
    exact: true,
  },
];

export const docsLinks: DocsLink[] = [
  { title: 'About stVaults', href: `${config.rootOrigin}/stvaults` },
  {
    title: 'Showcase',
    href: `${config.rootOrigin}/stvaults-products-overview`,
  },
  {
    title: 'How it works',
    href: `${config.rootOrigin}/how-lido-works/stvaults-basics`,
  },
  { title: 'DocCenter', href: `${config.docsOrigin}/run-on-lido/stvaults/` },
  { title: 'Leave feedback', href: FEEDBACK_SURVEY_URL },
];
