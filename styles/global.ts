import { createGlobalStyle } from 'styled-components';
import { ThemeName } from '@lidofinance/lido-ui';

import {
  NAV_MOBILE_HEIGHT,
  NAV_MOBILE_MAX_WIDTH,
  NAV_TABLET_MAX_WIDTH,
} from './constants';

export const devicesHeaderMedia = {
  tablet: `screen and (max-width: ${NAV_TABLET_MAX_WIDTH}px)`,
  mobile: `screen and (max-width: ${NAV_MOBILE_MAX_WIDTH}px)`,
};

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Fira Code';
    src: url('/fonts/fira-code.woff2') format('woff2');
    font-weight: 500;
    font-style: normal;
    font-display: swap;
  }

  :root {
    --nav-mobile-height: ${NAV_MOBILE_HEIGHT}px;
    --nav-mobile-max-width: ${NAV_MOBILE_MAX_WIDTH}px;
    --nav-desktop-gutter-x: 46px;

    --header-padding-y: 18px;
    --dot-size: 6px;

    --footer-max-width: 1424px;
    --footer-desktop-padding-x: 32px;
    --footer-desktop-padding-y: 24px;

    --footer-mobile-padding-x: 20px;
    --footer-mobile-padding-y: 18px;
    --footer-mobile-margin-bottom: 60px;

    --custom-background-secondary: ${({ theme }) => (theme.name === ThemeName.light ? '#F6F8FA' : '#2D2D35')};

    --nav-size: 160px;

    --nav-transition-duration: 0.15s;
    --nav-transition-timing-function: ease-out;

    --chart-health-rebalance: #8A2D38;
    --chart-health-danger: #D74758;
    --chart-health-warning: #EB9925;
    --chart-health-success: var(--lido-color-success);
  }

  * {
    margin: 0;
    padding: 0;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }

  svg {
    box-sizing: content-box;
  }

  html,
  body {
    width: 100%;
  }

  body {
    background: var(--lido-color-background);
    color: var(--lido-color-text);
    position: relative;
    box-sizing: border-box;
    font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
    line-height: 1.5em;
    font-weight: 500;
    text-size-adjust: none;
  }

  main {
    min-height: calc(100vh - 200px);
  }

  a {
    cursor: pointer;
    text-decoration: none;
    color: var(--lido-color-primary);

    &:visited {
      color: var(--lido-color-primary);
    }

    &:hover {
      color: var(--lido-color-primaryHover);
    }


  }
`;

export default GlobalStyle;
