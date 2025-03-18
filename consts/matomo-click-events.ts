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
    'Staking_Vault_Widget',
    'Push "Connect wallet" button',
    'staking_vault_widget_connect_wallet',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickShowMoreWallets]: [
    'Staking_Vault_Widget',
    'Push "More wallets" on wallet submit-modal',
    'staking_vault_widget_more_wallets',
  ],
  [MATOMO_CLICK_EVENTS_TYPES.clickShowLessWallets]: [
    'Staking_Vault_Widget',
    'Push "Less wallets" on wallet submit-modal',
    'staking_vault_widget_less_wallets',
  ],
};
