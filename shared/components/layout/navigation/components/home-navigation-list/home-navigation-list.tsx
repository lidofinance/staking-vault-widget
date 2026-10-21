import type { FC } from 'react';

import { homeRoutes } from 'shared/components/layout/navigation/const';

import { NavigationLink } from '../navigation-link';
import { NavList } from 'shared/components/layout/navigation/styles';

type HomeNavigationListProps = {
  // desktop gap between items, px
  gap?: number;
};

export const HomeNavigationList: FC<HomeNavigationListProps> = ({ gap }) => {
  return (
    <NavList $gap={gap}>
      {homeRoutes.map(({ title, path, icon, mobileIcon }) => (
        <NavigationLink
          key={path}
          icon={icon}
          mobileIcon={mobileIcon}
          title={title}
          path={path}
        />
      ))}
    </NavList>
  );
};
