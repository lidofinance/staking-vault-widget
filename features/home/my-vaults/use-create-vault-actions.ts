import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useConnectionFlow } from 'reef-knot';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const useCreateVaultActions = () => {
  const router = useRouter();
  const { startConnection } = useConnectionFlow();

  const handleConnect = useCallback(() => {
    void startConnection();
  }, [startConnection]);

  const handleCreate = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickCreateNewVault);
    void router.push(appPaths.vaults.create);
  }, [router]);

  return { handleConnect, handleCreate };
};
