import { useMemo } from 'react';
import { getHashFromObject } from 'utils/hash-from-object';
import { useVault } from 'modules/vaults';

export const useVaultDataHash = () => {
  const { activeVault } = useVault();

  return useMemo(() => getHashFromObject(activeVault), [activeVault]);
};
