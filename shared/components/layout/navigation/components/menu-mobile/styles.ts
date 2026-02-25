import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.div<{ $active: boolean }>`
  display: none;

  svg path {
    stroke: ${({ $active }) =>
      $active ? `var(--lido-color-primary)` : `var(--lido-color-secondary)`};
  }

  @media ${devicesHeaderMedia.mobile} {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    white-space: break-spaces;
    text-wrap: balance;
    line-break: anywhere;
    font-size: ${({ theme }) => theme.fontSizesMap.xxxs}px;
    line-height: 1.7em;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    opacity: ${(props) => (props.$active ? 1 : 0.8)};
  }
`;

export const MenuItem = styled.li`
  display: none;

  @media ${devicesHeaderMedia.mobile} {
    display: flex;
    align-items: center;
    flex-grow: 1;
    justify-content: center;
  }
`;

export const WrapperButton = styled.button`
  display: contents;
  margin: 0;
  padding: 0;
  border: 0;
  appearance: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font: inherit;
`;

export const HiddenNavContainer = styled.div<{ $showMenu: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 77px;
  display: ${({ $showMenu }) => ($showMenu ? 'flex' : 'none')};
  width: 100%;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(10px);
`;

export const HiddenNav = styled.ul`
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: auto;
  height: auto;
  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.colors.background};

  li {
    width: 100% !important;
    justify-content: left;

    a > span {
      flex-direction: row;
    }
  }
`;
