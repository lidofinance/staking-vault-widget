import { useCallback } from 'react';
import { ArrowLeft, Text } from '@lidofinance/lido-ui';
import { useRouter } from 'next/router';

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
  const router = useRouter();

  const handleBackToSettings = useCallback(() => {
    if (!vaultAddress) {
      return;
    }

    trackAllVaultsPageEvent();
    void router.push(appPaths.vaults.vault(vaultAddress).settings('main'));
  }, [router, vaultAddress]);

  return (
    <Container onClick={handleBackToSettings}>
      <ArrowLeft />
      <Text size="xs" color="secondary">
        Back to settings
      </Text>
    </Container>
  );
};
