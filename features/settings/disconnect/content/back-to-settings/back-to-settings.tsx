import { useMemo } from 'react';
import { ArrowLeft, Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';
import { trackMatomoEvent } from 'utils/track-matomo-event';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

import { Container } from './styles';

const trackAllVaultsPageEvent = () => {
  trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickSettingsMainSettingsTab);
};

export const BackToSettings = () => {
  const { vaultAddress } = useVault();

  const linkToMainSettings = useMemo(() => {
    if (!vaultAddress) {
      return '#';
    }

    return appPaths.vaults.vault(vaultAddress).settings('main');
  }, [vaultAddress]);

  return (
    <Container
      onClick={trackAllVaultsPageEvent}
      href={linkToMainSettings}
      data-testid="back-to-settings"
    >
      <ArrowLeft />
      <Text size="xs" color="secondary" as="span">
        Back to settings
      </Text>
    </Container>
  );
};
