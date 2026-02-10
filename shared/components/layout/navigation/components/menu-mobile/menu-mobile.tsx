import {
  type FC,
  useMemo,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';

import { useVault } from 'modules/vaults';
import { ReactComponent as BurgerIcon } from 'assets/icons/burger-icon.svg';

import { Navigations } from 'shared/components/layout/navigation/components';
import { vaultRoutes } from 'shared/components/layout/navigation/const';

import {
  Container,
  HiddenNav,
  HiddenNavContainer,
  MenuItem,
  WrapperButton,
} from './styles';

export const MenuMobile: FC = () => {
  const { vaultAddress } = useVault();
  const [showMenu, setMobileMenuVisibility] = useState(false);
  const ref = useRef();
  const routesForMenu = useMemo(
    () =>
      vaultAddress
        ? vaultRoutes(vaultAddress).filter(({ inMobileMenu }) => inMobileMenu)
        : [],
    [vaultAddress],
  );

  useEffect(() => {
    const listenClose = (event: MouseEvent) => {
      const isClickInside = !!ref.current?.contains(event.target);
      if (showMenu && !isClickInside) {
        setMobileMenuVisibility(false);
      }
    };

    document.addEventListener('click', listenClose);

    return () => {
      document.removeEventListener('click', listenClose);
    };
  }, [showMenu]);

  const onCloseMenu = useCallback(() => {
    setMobileMenuVisibility(false);
  }, []);

  const onToggleMenu = (e) => {
    e.stopPropagation();
    setMobileMenuVisibility(!showMenu);
  };

  return (
    <MenuItem ref={ref} onClick={onCloseMenu}>
      <WrapperButton onClick={onToggleMenu}>
        <Container $active={showMenu}>
          <BurgerIcon />
          <span>Other</span>
        </Container>
      </WrapperButton>
      <HiddenNavContainer $showMenu={showMenu}>
        <HiddenNav>
          <Navigations routes={routesForMenu} />
        </HiddenNav>
      </HiddenNavContainer>
    </MenuItem>
  );
};
