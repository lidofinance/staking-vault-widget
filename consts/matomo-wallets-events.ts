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
  binanceWallet: ['Binance Web3', 'binance_web3'],
  bitget: ['BitGet', 'bitget'],
  brave: ['Brave', 'brave'],
  browserExtension: ['Browser', 'browser'],
  coin98: ['Coin98', 'coin98'],
  coinbase: ['Coinbase Wallet', 'coinbase_wallet'],
  coinbaseSmartWallet: ['Coinbase Smart Wallet', 'coinbase_smart_wallet'],
  exodus: ['Exodus', 'exodus'],
  imToken: ['imToken', 'imtoken'],
  ledgerHID: ['Ledger', 'ledger'],
  metaMask: ['Metamask', 'metamask'],
  okx: ['OKX', 'okx'],
  trust: ['Trust', 'trust'],
  walletConnect: ['WalletConnect', 'walletconnect'],
  ctrl: ['Ctrl', 'ctrl'],
} as const;

const EVENTS_DATA_CONNECT_SUCCESS: EventsData = {
  ...EVENTS_DATA_CONNECT_START,
  ambire: ['Ambire', 'ambire'],
  binanceWallet: ['Binance Web3', 'binance_web3_wallet'],
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
