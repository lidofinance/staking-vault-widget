import { Text } from '@lidofinance/lido-ui';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { AllVaults, ArrowBackStyled } from './styles';

const trackAllVaultsPageEvent = () => {
  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickNaviAllVaults);
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
