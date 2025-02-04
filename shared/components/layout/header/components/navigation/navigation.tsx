import { FC, memo, useMemo } from 'react';
import { Stake } from '@lidofinance/lido-ui';

import { HOME_PATH, getPathWithoutFirstSlash } from 'consts/urls';
import { useConfig } from 'config';
import { ManifestConfigPage } from 'config/external-config';
import { LocalLink } from 'shared/components/local-link';
import { useRouterPath } from 'shared/hooks/use-router-path';

import { Nav, NavLink } from './styles';

type PageRoute = {
  name: string;
  path: string;
  icon: React.ReactNode;
  exact?: boolean;
  full_path?: string;
  subPaths?: string[];
};

const routes: PageRoute[] = [
  {
    name: 'Home',
    path: HOME_PATH,
    icon: <Stake data-testid="navStake" />,
    exact: true,
  },
];

export const Navigation: FC = memo(() => {
  const pathname = useRouterPath();
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
  if (pathnameWithoutQuery[pathnameWithoutQuery.length - 1] === '/') {
    // Remove last '/'
    pathnameWithoutQuery = pathnameWithoutQuery.slice(0, -1);
  }

  return (
    <Nav>
      {availableRoutes.map(({ name, path, subPaths, icon }) => {
        const isActive =
          pathnameWithoutQuery === getPathWithoutFirstSlash(path) ||
          (path.length > 1 && pathnameWithoutQuery.startsWith(path)) ||
          (Array.isArray(subPaths) &&
            subPaths?.indexOf(pathnameWithoutQuery) > -1);

        return (
          <LocalLink key={path} href={path}>
            <NavLink active={isActive}>
              {icon}
              <span>{name}</span>
            </NavLink>
          </LocalLink>
        );
      })}
    </Nav>
  );
});
