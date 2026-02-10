import { useMemo } from 'react';
import { useBreakpoint } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { Navigations } from 'shared/components/layout/navigation/components';
import { vaultRoutes } from 'shared/components/layout/navigation/const';

// TODO: rename to MenuAll
export const MenuDesktop = () => {
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

  return <Navigations routes={availableRoutes} />;
};
