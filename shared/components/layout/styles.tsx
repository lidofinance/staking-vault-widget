import { H1, Container } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

const templateAreas = {
  withError: `
    'header header header'
    'error error error'
    'nav content empty'
    'cookie cookie cookie'
    'footer footer footer';`,
  default: `
    'header header header'
    'nav content empty'
    'cookie cookie cookie'
    'footer footer footer';`,
};

const tabletTemplateAreas = {
  withError: `
    'header header'
    'error error'
    'nav content'
    'cookie cookie'
    'footer footer';`,
  default: `
    'header header'
    'nav content'
    'cookie cookie'
    'footer footer';`,
};

const mobileTemplateAreas = {
  withError: `
    'header'
    'error'
    'content'
    'cookie'
    'footer';`,
  default: `
    'header'
    'content'
    'cookie'
    'footer';`,
};

export const LayoutStyles = styled(Container)<{ isError: boolean }>`
  position: relative;
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 260px 1fr 160px;
  grid-template-areas: ${({ isError }) =>
    templateAreas[isError ? 'withError' : 'default']};
  grid-column-gap: 0;
  grid-row-gap: 16px;
  min-height: 100vh;
  height: auto;

  @media ${devicesHeaderMedia.laptop} {
    grid-template-columns: 200px 1fr;
    grid-template-areas: ${({ isError }) =>
      tabletTemplateAreas[isError ? 'withError' : 'default']};
  }

  @media ${devicesHeaderMedia.mobile} {
    grid-template-columns: 1fr;
    grid-template-areas: ${({ isError }) =>
      mobileTemplateAreas[isError ? 'withError' : 'default']};
  }
`;

export const LayoutTitle = styled((props) => <H1 {...props} />)`
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  margin-bottom: 0.2em;
  line-height: 1.2em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const LayoutSubTitle = styled.h4`
  font-weight: 500;
  color: var(--lido-color-textSecondary);
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 1.5em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const IPFSInfoBoxOnlyMobileAndPortableWrapper = styled.div`
  display: none;

  @media ${devicesHeaderMedia.mobile} {
    display: block;
    margin-top: -6px;
    margin-bottom: 40px;
  }
`;
