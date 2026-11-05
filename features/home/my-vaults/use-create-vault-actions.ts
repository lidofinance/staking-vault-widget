import { useCallback } from 'react';
import { useRouter } from 'next/router';
import { useConnect } from 'reef-knot/core-react';

import { trackMatomoEvent } from 'utils/track-matomo-event';
import { appPaths } from 'consts/routing';
import { MATOMO_CLICK_EVENTS_TYPES } from 'consts/matomo-click-events';

export const useCreateVaultActions = () => {
  const router = useRouter();
  const { connect } = useConnect();

  const handleConnect = useCallback(() => {
    void connect();
  }, [connect]);

  const handleCreate = useCallback(() => {
    trackMatomoEvent(MATOMO_CLICK_EVENTS_TYPES.clickCreateNewVault);
    void router.push(appPaths.vaults.create);
  }, [router]);

  return { handleConnect, handleCreate };
};
