import { FC, memo, useMemo, ReactNode } from 'react';
import { Address } from 'viem';
import { Stake, Withdraw, Wrap, Text } from '@lidofinance/lido-ui';

import { ReactComponent as GearIcon } from 'assets/icons/gear.svg';
import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { getPathWithoutFirstSlash, AppPaths } from 'consts/urls';
import { useConfig } from 'config';
import { ManifestConfigPage } from 'config/external-config';
import { useRouterPath } from 'shared/hooks/use-router-path';
import { useDappStatus } from 'modules/web3';

import { LocalLink } from 'shared/components/local-link';
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
  const { isWalletConnected } = useDappStatus();
  const router = useRouter();
  const { vaultAddress } = router.query as {
    vaultAddress: Address | undefined;
  };
  const showNavigation = pathname !== AppPaths.main && isWalletConnected;
  const showNavList = !pathname.includes(AppPaths.createVault);

  const {
    externalConfig: { pages },
  } = useConfig();

  const availableRoutes = useMemo(() => {
    if (!pages) return saturatePathsByAddress(routes, vaultAddress);

    const paths = Object.keys(pages) as ManifestConfigPage[];
    const filteredRoutes = routes.filter((route) => {
      const path = paths.find((path) => route.path.includes(path));
      if (!path) return true;
      return !pages[path]?.shouldDisable;
    });

    return saturatePathsByAddress(filteredRoutes, vaultAddress);
  }, [pages, vaultAddress]);

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
        <Text size="xxs" strong>
          All vaults
        </Text>
      </AllVaults>
      {showNavList && (
        <>
          <SelectedVault />
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
