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

export const walletMetricProps: MetricProps = {
  onConnectSuccess: () => {
    trackEvent(...MATOMO_CLICK_EVENTS.walletConnected);
  },
  onAutoConnect: () => {
    trackEvent(...MATOMO_CLICK_EVENTS.walletAutoConnected);
  },
  onReconnect: () => {
    trackEvent(...MATOMO_CLICK_EVENTS.walletReConnected);
  },
};
