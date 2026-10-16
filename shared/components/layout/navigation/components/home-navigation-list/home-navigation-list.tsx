import { homeRoutes } from 'shared/components/layout/navigation/const';

import { NavigationLink } from '../navigation-link';
import { NavList } from '../vault-navigation/styles';

export const HomeNavigationList = () => {
  return (
    <NavList>
      {homeRoutes.map(({ title, path, icon }) => (
        <NavigationLink icon={icon} title={title} path={path} key={path} />
      ))}
    </NavList>
  );
};
