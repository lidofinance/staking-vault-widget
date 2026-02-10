import { useMemo } from 'react';
import { useBreakpoint } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { NavigationList } from 'shared/components/layout/navigation/components';
import { vaultRoutes } from 'shared/components/layout/navigation/const';

export const MenuAll = () => {
  const { vaultAddress } = useVault();
  const isMobile = useBreakpoint('lg');

  const availableRoutes = useMemo(() => {
    if (!vaultAddress) {
      return [];
    }

    return vaultRoutes(vaultAddress).filter(
      ({ inMobileMenu }) => !isMobile || !inMobileMenu,
    );
  }, [vaultAddress, isMobile]);

  return <NavigationList routes={availableRoutes} />;
};
