import { type FC, useMemo } from 'react';

import { useVault } from 'modules/vaults';
import { ReactComponent as BurgerIcon } from 'assets/icons/burger-icon.svg';

import { NavigationList } from 'shared/components/layout/navigation/components';
import { vaultRoutes } from 'shared/components/layout/navigation/const';
import { useMobileMenu } from 'shared/components/layout/navigation/hooks';

import {
  Container,
  HiddenNav,
  HiddenNavContainer,
  MenuItem,
  WrapperButton,
} from './styles';

export const MenuMobile: FC = () => {
  const { vaultAddress, activeVault } = useVault();
  const { ref, isOpen, close, toggle } = useMobileMenu();
  const routesForMenu = useMemo(
    () =>
      vaultAddress
        ? vaultRoutes(vaultAddress).filter(({ inMobileMenu }) => inMobileMenu)
        : [],
    [vaultAddress],
  );

  if (!activeVault) {
    return null;
  }

  return (
    <MenuItem ref={ref} onClick={close}>
      <WrapperButton onClick={toggle}>
        <Container $active={isOpen}>
          <BurgerIcon />
          <span>Other</span>
        </Container>
      </WrapperButton>
      <HiddenNavContainer $showMenu={isOpen}>
        <HiddenNav>
          <NavigationList routes={routesForMenu} />
        </HiddenNav>
      </HiddenNavContainer>
    </MenuItem>
  );
};
