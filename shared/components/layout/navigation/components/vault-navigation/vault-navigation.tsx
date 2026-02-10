import {
  MenuDesktop,
  MenuMobile,
} from 'shared/components/layout/navigation/components';

import { NavList } from './styles';

export const VaultNavigationList = () => {
  return (
    <NavList>
      <MenuDesktop />
      <MenuMobile />
    </NavList>
  );
};
