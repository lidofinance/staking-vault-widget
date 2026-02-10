import {
  MenuAll,
  MenuMobile,
} from 'shared/components/layout/navigation/components';

import { NavList } from './styles';

export const VaultNavigationList = () => {
  return (
    <NavList>
      <MenuAll />
      <MenuMobile />
    </NavList>
  );
};
