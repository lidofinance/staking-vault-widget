import { FC, memo, useMemo, ReactNode } from 'react';
import { Stake } from '@lidofinance/lido-ui';

import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { getPathWithoutFirstSlash, AppPaths } from 'consts/urls';
import { useConfig } from 'config';
import { ManifestConfigPage } from 'config/external-config';
import { useRouterPath } from 'shared/hooks/use-router-path';
import { useDappStatus } from 'modules/web3';

import { LocalLink } from 'shared/components/local-link';
import { SelectAddress } from 'shared/components/layout/navigation/select-address';
import {
  ListItem,
  NavLink,
  Nav,
  AllVaults,
  ArrowBackStyled,
  NavList,
} from './styles';

type PageRoute = {
  name: string;
  path: string;
  icon: ReactNode;
  exact?: boolean;
  full_path?: string;
  subPaths?: string[];
};
const routes: PageRoute[] = [
  {
    name: 'Home',
    path: AppPaths.main,
    icon: <Stake data-testid="navHome" />,
    exact: true,
  },
  {
    name: 'Settings',
    path: AppPaths.settings,
    icon: <GearIcon data-testid="navSettings" />,
    exact: true,
  },
];

export const Navigation: FC = memo(() => {
  const pathname = useRouterPath();
  const { isWalletConnected } = useDappStatus();
  const showNavigation = pathname !== AppPaths.main && isWalletConnected;
  const showNavList = !pathname.includes(AppPaths.createVault);

  const {
    externalConfig: { pages },
  } = useConfig();

  const availableRoutes = useMemo(() => {
    if (!pages) return routes;

    const paths = Object.keys(pages) as ManifestConfigPage[];
    return routes.filter((route) => {
      const path = paths.find((path) => route.path.includes(path));
      if (!path) return true;
      return !pages[path]?.shouldDisable;
    });
  }, [pages]);

  let pathnameWithoutQuery = pathname.split('?')[0];
  if (pathnameWithoutQuery.endsWith('/')) {
    // Remove last '/'
    pathnameWithoutQuery = pathnameWithoutQuery.slice(0, -1);
  }

  return (
    <Nav showNavigation={showNavigation}>
      <AllVaults href={AppPaths.main}>
        <ArrowBackStyled />
        &nbsp;
        <span>All vaults</span>
      </AllVaults>
      {showNavList && (
        <>
          <SelectAddress />
          <NavList>
            {availableRoutes.map(({ name, path, subPaths, icon }) => {
              const isActive =
                pathnameWithoutQuery === getPathWithoutFirstSlash(path) ||
                (path.length > 1 && pathnameWithoutQuery.startsWith(path)) ||
                (Array.isArray(subPaths) &&
                  subPaths?.indexOf(pathnameWithoutQuery) > -1);

              return (
                <ListItem key={path}>
                  <LocalLink href={path}>
                    <NavLink active={isActive}>
                      {icon}
                      <span>{name}</span>
                    </NavLink>
                  </LocalLink>
                </ListItem>
              );
            })}
          </NavList>
        </>
      )}
    </Nav>
  );
});
