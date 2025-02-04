import { MatomoEventType } from '@lidofinance/analytics-matomo';

export const enum MATOMO_CLICK_EVENTS_TYPES {
  // Global
  connectWallet = 'connectWallet',
  clickShowMoreWallets = 'clickShowMoreWallets',
  clickShowLessWallets = 'clickShowLessWallets',
}

export const MATOMO_CLICK_EVENTS: Record<
  MATOMO_CLICK_EVENTS_TYPES,
  MatomoEventType
> = {
  // Global
  [MATOMO_CLICK_EVENTS_TYPES.connectWallet]: [
    'Ethereum_Staking_Widget',
    'Push "Connect wallet" button',
    'eth_widget_connect_wallet',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickShowMoreWallets]: [
    'Ethereum_Staking_Widget',
    'Push "More wallets" on wallet modal',
    'eth_widget_more_wallets',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickShowLessWallets]: [
    'Ethereum_Staking_Widget',
    'Push "Less wallets" on wallet modal',
    'eth_widget_less_wallets',
  ],
};
