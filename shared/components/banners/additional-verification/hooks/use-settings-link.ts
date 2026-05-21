import { useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { appPaths } from 'consts/routing';

export const useVaultSettingsLink = (settings: 'main' | 'tier') => {
  const { vaultAddress } = useVault();

  return useMemo(() => {
    if (!vaultAddress) return '#';

    return appPaths.vaults.vault(vaultAddress).settings(settings);
  }, [settings, vaultAddress]);
};
