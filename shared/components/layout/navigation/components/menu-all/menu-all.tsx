import { useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { useMatchMedia } from 'shared/hooks';
import { NAV_MOBILE_MAX_WIDTH } from 'styles/constants';

import { NavigationList } from 'shared/components/layout/navigation/components';
import {
  vaultPathnames,
  vaultRoutes,
} from 'shared/components/layout/navigation/const';

export const MenuAll = () => {
  const { vaultAddress } = useVault();
  const { isMatched } = useMatchMedia(NAV_MOBILE_MAX_WIDTH);

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

  return <NavigationList routes={availableRoutes} />;
};
