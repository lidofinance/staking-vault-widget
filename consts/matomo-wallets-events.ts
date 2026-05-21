import type {
  ReefKnotConfig,
  ReefKnotWalletsModalConfig,
} from '@reef-knot/types';
import type { WalletIdsEthereum } from 'reef-knot/wallets';

import { trackMatomoEvent } from 'utils/track-matomo-event';

import { MATOMO_CLICK_EVENTS_TYPES } from './matomo-click-events';

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
  anchorageDigital: ['Anchorage Digital', 'anchorage_digital'],
} as const;

const EVENTS_DATA_CONNECT_SUCCESS: EventsData = {
  ...EVENTS_DATA_CONNECT_START,
  ambire: ['Ambire', 'ambire'],
};

export const walletMetricProps: MetricProps = {
  onConnectSuccess: ({ walletId }) => {
    const eventData = EVENTS_DATA_CONNECT_SUCCESS[walletId];
    if (eventData) {
      trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.walletConnected);
    }
  },
  onAutoConnect: () => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.walletAutoConnected);
  },
  onReconnect: () => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.walletReConnected);
  },
};
