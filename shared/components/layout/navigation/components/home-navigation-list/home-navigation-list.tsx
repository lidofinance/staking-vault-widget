import type { FC } from 'react';

import { homeRoutes } from 'shared/components/layout/navigation/const';

import { NavigationLink } from '../navigation-link';
import { NavList } from '../vault-navigation/styles';

type HomeNavigationListProps = {
  // desktop gap between items, px
  gap?: number;
};

export const HomeNavigationList: FC<HomeNavigationListProps> = ({ gap }) => {
  return (
    <NavList $gap={gap}>
      {homeRoutes.map(({ title, path, icon }) => (
        <NavigationLink icon={icon} title={title} path={path} key={path} />
      ))}
    </NavList>
  );
};
