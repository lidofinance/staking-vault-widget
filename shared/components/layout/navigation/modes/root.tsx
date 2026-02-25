import { appPaths } from 'consts/routing';

import { NavigationLink } from '../components';
import { NavigationRoutes } from '../types';
import { NavList } from '../components/vault-navigation/styles';

const homeRoutes: NavigationRoutes[] = [
  {
    title: 'My vaults',
    path: appPaths.myVaults,
    icon: 'mosaic',
    exact: true,
  },
  {
    title: 'All Vaults',
    path: appPaths.vaults.all,
    icon: 'stake',
    exact: true,
  },
];

export const RootNavigation = () => {
  return (
    <NavList>
      {homeRoutes.map(({ title, path, icon }) => {
        return (
          <NavigationLink icon={icon} title={title} path={path} key={path} />
        );
      })}
    </NavList>
  );
};
