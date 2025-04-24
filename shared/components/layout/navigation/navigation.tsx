import { FC, memo, useMemo, ReactNode } from 'react';
import { Address } from 'viem';
import { Stake, Withdraw, Wrap, Text } from '@lidofinance/lido-ui';

import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { getPathWithoutFirstSlash, AppPaths } from 'consts/urls';
import { useConfig } from 'config';
import { ManifestConfigPage } from 'config/external-config';
import { useRouterPath } from 'shared/hooks/use-router-path';

import Link from 'next/link';

import { SelectedVault } from 'shared/components/layout/navigation/selected-vault';
import {
  ListItem,
  NavLink,
  Nav,
  AllVaults,
  ArrowBackStyled,
  NavList,
} from './styles';
import { useRouter } from 'next/router';

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
    name: 'Overview',
    path: AppPaths.overview,
    icon: <MosaicIcon />,
    exact: true,
  },
  {
    name: 'Supply/Withdraw',
    path: AppPaths.supply,
    icon: <Stake />,
    exact: true,
  },
  {
    name: 'Mint/Repay stETH',
    path: AppPaths.adjustment,
    icon: <Withdraw />,
    exact: true,
  },
  {
    name: 'Validators',
    path: AppPaths.validators,
    icon: <Wrap />,
    exact: true,
  },
  {
    name: 'Claim Fees',
    path: AppPaths.claim,
    icon: <Withdraw />,
    exact: true,
  },
  {
    name: 'Settings',
    path: AppPaths.settings,
    icon: <GearIcon />,
    exact: true,
  },
];

const homeRoutes: PageRoute[] = [
  {
    name: 'My vaults',
    path: `${AppPaths.main}?mode=personal`,
    icon: <MosaicIcon />,
    exact: true,
  },
  {
    name: 'All Vaults',
    path: AppPaths.main,
    icon: <Stake />,
    exact: true,
  },
];

// TODO: find more clearable way to map routes
const saturatePathsByAddress = (
  routes: PageRoute[],
  vaultAddress: Address | undefined,
) => {
  return routes.map((route) => {
    const { path, ...rest } = route;
    const newPath = vaultAddress ? `/${vaultAddress}${path}` : path;
    return { path: newPath, ...rest };
  });
};

export const Navigation: FC = memo(() => {
  const pathname = useRouterPath();
  const router = useRouter();
  const { vaultAddress } = router.query as {
    vaultAddress: Address | undefined;
  };

  const isMainPage = router.pathname === AppPaths.main;
  const showNavList = !pathname.includes(AppPaths.createVault);

  const {
    externalConfig: { pages },
  } = useConfig();

  const availableRoutes = useMemo(() => {
    if (isMainPage) return homeRoutes;
    if (!pages) return saturatePathsByAddress(routes, vaultAddress);

    const paths = Object.keys(pages) as ManifestConfigPage[];
    const filteredRoutes = routes.filter((route) => {
      const path = paths.find((path) => route.path.includes(path));
      if (!path) return true;
      return !pages[path]?.shouldDisable;
    });

    return saturatePathsByAddress(filteredRoutes, vaultAddress);
  }, [pages, vaultAddress, isMainPage]);

  let pathnameWithoutQuery = pathname.split('?')[0];
  if (pathnameWithoutQuery.endsWith('/')) {
    // Remove last '/'
    pathnameWithoutQuery = pathnameWithoutQuery.slice(0, -1);
  }

  const checkIsActivePath = (path: string, subPaths: string[] | undefined) => {
    if (isMainPage) {
      const queryString = path.split('?')[1] || '';
      const queryParams = new URLSearchParams(queryString);
      const routeMode = queryParams.get('mode');

      const currentMode = Array.isArray(router.query.mode)
        ? router.query.mode[0]
        : router.query.mode || '';

      if (!routeMode && !currentMode) {
        return true;
      }

      return currentMode === routeMode;
    }

    return (
      pathnameWithoutQuery === getPathWithoutFirstSlash(path) ||
      (path.length > 1 && pathnameWithoutQuery.startsWith(path)) ||
      (Array.isArray(subPaths) && subPaths.indexOf(pathnameWithoutQuery) > -1)
    );
  };

  return (
    <Nav>
      {!isMainPage && (
        <AllVaults href={AppPaths.main}>
          <ArrowBackStyled />
          &nbsp;
          <Text size="xxs" strong>
            All vaults
          </Text>
        </AllVaults>
      )}
      {showNavList && (
        <>
          <SelectedVault />
          <NavList>
            {availableRoutes.map(({ name, path, subPaths, icon }) => {
              const isActive = checkIsActivePath(path, subPaths);
              return (
                <ListItem key={path}>
                  <Link href={path}>
                    <NavLink active={isActive}>
                      {icon}
                      <span>{name}</span>
                    </NavLink>
                  </Link>
                </ListItem>
              );
            })}
          </NavList>
        </>
      )}
    </Nav>
  );
});
