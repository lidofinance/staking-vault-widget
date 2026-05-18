import { trackEvent } from '@lidofinance/analytics-matomo';
import type {
  ReefKnotConfig,
  ReefKnotWalletsModalConfig,
} from '@reef-knot/types';
import type { WalletIdsEthereum } from 'reef-knot/wallets';

import { MATOMO_CLICK_EVENTS } from './matomo-click-events';

type MetricProps = Pick<
  ReefKnotWalletsModalConfig<WalletIdsEthereum>,
  | 'onClickTermsAccept'
  | 'onClickWalletsMore'
  | 'onClickWalletsLess'
  | 'onConnectStart'
  | 'onConnectSuccess'
> &
  Pick<ReefKnotConfig, 'onAutoConnect' | 'onReconnect'>;

type EventsData = Partial<Record<WalletIdsEthereum, [string, string]>>;

const EVENTS_DATA_CONNECT_START: EventsData = {
  ambire: ['on Ambire', 'ambire'],
  bitget: ['BitGet', 'bitget'],
  browserExtension: ['Browser', 'browser'],
  coinbaseSmartWallet: ['Coinbase Smart Wallet', 'coinbase_smart_wallet'],
  imToken: ['imToken', 'imtoken'],
  ledgerHID: ['Ledger', 'ledger'],
  metaMask: ['Metamask', 'metamask'],
  okx: ['OKX', 'okx'],
  walletConnect: ['WalletConnect', 'walletconnect'],
} as const;

const EVENTS_DATA_CONNECT_SUCCESS: EventsData = {
  ...EVENTS_DATA_CONNECT_START,
  ambire: ['Ambire', 'ambire'],
};

export const walletMetricProps: MetricProps = {
  onConnectSuccess: ({ walletId }) => {
    const eventData = EVENTS_DATA_CONNECT_SUCCESS[walletId];
    if (eventData) {
      trackEvent(...MATOMO_CLICK_EVENTS.walletConnected);
    }
  },
  onAutoConnect: () => {
    trackEvent(...MATOMO_CLICK_EVENTS.walletAutoConnected);
  },
  onReconnect: () => {
    trackEvent(...MATOMO_CLICK_EVENTS.walletReConnected);
  },
};
