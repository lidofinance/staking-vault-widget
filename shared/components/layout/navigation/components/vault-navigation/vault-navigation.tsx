import {
  MenuAll,
  MenuMobile,
} from 'shared/components/layout/navigation/components';

import { NavList } from 'shared/components/layout/navigation/styles';

export const VaultNavigationList = () => {
  return (
    <NavList>
      <MenuAll />
      <MenuMobile />
    </NavList>
  );
};
