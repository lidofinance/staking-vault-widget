import { appPaths } from 'consts/routing';
import { Stake } from '@lidofinance/lido-ui';

import { ReactComponent as MosaicIcon } from 'assets/icons/mosaic.svg';
import { NavigationLink } from '../navigation-link';
import { NavList } from '../styles';

const HomeRoutes = [
  {
    title: 'My vaults',
    path: appPaths.myVaults,
    icon: <MosaicIcon />,
    exact: true,
  },
  {
    title: 'All Vaults',
    path: appPaths.vaults.all,
    icon: <Stake />,
    exact: true,
  },
];

export const RootNavigation = () => {
  return (
    <NavList>
      {HomeRoutes.map(({ title, path, icon }) => {
        return (
          <NavigationLink icon={icon} title={title} path={path} key={path} />
        );
      })}
    </NavList>
  );
};
