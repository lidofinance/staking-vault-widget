import styled from 'styled-components';
import Link from 'next/link';
import { ArrowBack } from '@lidofinance/lido-ui';
import { devicesHeaderMedia } from 'styles/global';

export const Nav = styled.nav`
  --nav-size: 154px;
  grid-area: nav;
  z-index: 6;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  width: var(--nav-size);
  transition: width var(--nav-transition-duration)
    var(--nav-transition-timing-function);

  svg {
    margin-right: 8px;
  }
`;

export const NavList = styled.ul`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  list-style-type: none;
`;

export const ListItem = styled.div`
  display: flex;
  align-items: center;
`;

// Not wrapping <a> inside <a> in IPFS mode
// Also avoid problems with migrate to Next v13
// see: https://nextjs.org/docs/app/building-your-application/upgrading/app-router-migration#link-component
export const NavLink = styled.span<{ active: boolean }>`
  cursor: pointer;
  color: var(--lido-color-secondary);
  font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
  line-height: 1.7em;
  font-weight: 800;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  text-decoration: none !important;
  letter-spacing: 0.04em;
  opacity: ${(props) => (props.active ? 1 : 0.8)};

  &:hover {
    opacity: 1;
    color: var(--lido-color-secondary);
  }

  svg {
    fill: ${({ active }) =>
      active ? `var(--lido-color-primary)` : `var(--lido-color-secondary)`};
  }

  @media ${devicesHeaderMedia.mobile} {
    // TODO
  }
`;

export const AllVaults = styled(Link)`
  display: flex;
  align-items: center;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: var(--lido-color-secondary);
  opacity: 0.8;

  svg {
    opacity: 0.9;
  }

  &:visited,
  &:hover {
    color: var(--lido-color-secondary);
  }

  &:hover {
    opacity: 1;

    svg {
      opacity: 1;
    }
  }
`;

export const ArrowBackStyled = styled(ArrowBack)`
  width: 14px;
  height: 14px;
  margin-right: ${({ theme }) => theme.spaceMap.sm}px;
`;
