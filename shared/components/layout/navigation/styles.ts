import styled from 'styled-components';

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

  @media ${devicesHeaderMedia.mobile} {
    position: fixed;
    left: 0;
    bottom: 0;
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

export const FeedbackLink = styled.a`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.spaceMap.xxl}px;
  padding-top: ${({ theme }) => theme.spaceMap.xxl}px;
  border-top: 1px solid var(--lido-color-border);

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;

export const SelectedVaultWrapper = styled.div`
  position: relative;
  display: flex;
  justify-content: end;
  align-items: center;
  margin: ${({ theme }) => theme.spaceMap.md}px 0 0;
  height: 32px;
  width: fit-content;
  border-radius: 40px;
  border: 1px solid var(--lido-color-accentBorderHover);
  background-color: var(--lido-color-background);
  overflow: clip;

  @media ${devicesHeaderMedia.mobile} {
    display: none;
  }
`;
