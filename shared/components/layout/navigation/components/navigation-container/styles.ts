import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Nav = styled.nav<{ $hide: boolean }>`
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

  @media ${devicesHeaderMedia.mobile} {
    position: fixed;
    left: 0;
    bottom: 0;
    display: ${({ $hide }) => ($hide ? 'none' : 'flex')};
    flex-direction: row;
    padding: ${({ theme }) => theme.spaceMap.md}px;
    background-color: ${({ theme }) => theme.colors.foreground};
    height: fit-content;
    width: 100%;
    border-start-end-radius: 12px;
    border-start-start-radius: 12px;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);

    svg {
      margin-right: 0;
    }
  }
`;
