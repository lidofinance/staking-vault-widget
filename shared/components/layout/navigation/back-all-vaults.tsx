import { Text } from '@lidofinance/lido-ui';
import { trackEvent } from '@lidofinance/analytics-matomo';

import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS } from 'consts/matomo-click-events';

import { AllVaults, ArrowBackStyled } from './styles';

const trackAllVaultsPageEvent = () => {
  trackEvent(...MATOMO_CLICK_EVENTS.clickNaviAllVaults);
};

export const BackAllVaults = () => (
  <AllVaults onClick={trackAllVaultsPageEvent} href={appPaths.vaults.all}>
    <ArrowBackStyled />
    &nbsp;
    <Text size="xxs" strong>
      All vaults
    </Text>
  </AllVaults>
);
