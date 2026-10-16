import { useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { useMatchMedia } from 'shared/hooks';
import { NAV_MOBILE_MAX_WIDTH } from 'styles/constants';

import {
  NavigationList,
  NavigationListLoader,
} from 'shared/components/layout/navigation/components';
import {
  vaultPathnames,
  vaultRoutes,
} from 'shared/components/layout/navigation/const';
import { useVaultNavLoading } from 'shared/components/layout/navigation/hooks';

export const MenuAll = () => {
  const { vaultAddress } = useVault();
  const { isMatched } = useMatchMedia(NAV_MOBILE_MAX_WIDTH);
  const isLoading = useVaultNavLoading();

  const availableRoutes = useMemo(() => {
    if (!vaultAddress) {
      return [];
    }

    return vaultRoutes(vaultAddress)
      .filter(({ inMobileMenu }) => !isMatched || !inMobileMenu)
      .map((route) => {
        const pathInfo = vaultPathnames.find(
          (pathInfo) => pathInfo.title === route.title,
        );

        return { ...route, pathname: pathInfo?.path ?? '' };
      });
  }, [vaultAddress, isMatched]);

  if (isLoading) {
    return <NavigationListLoader count={vaultPathnames.length} />;
  }

  return <NavigationList routes={availableRoutes} />;
};
