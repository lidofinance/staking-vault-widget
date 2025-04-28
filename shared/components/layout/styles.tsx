import { H1, Container } from '@lidofinance/lido-ui';
import styled from 'styled-components';
import { devicesHeaderMedia } from 'styles/global';

const templateAreas = {
  withError: `
    'header header header'
    'error error error'
    'nav content empty'
    'footer footer footer';`,
  default: `
    'header header header'
    'nav content empty'
    'footer footer footer';`,
};

export const LayoutStyles = styled(Container)<{ isError: boolean }>`
  position: relative;
  display: grid;
  grid-template-rows: min-content 1fr;
  grid-template-columns: 166px 1fr 166px;
  grid-template-areas: ${({ isError }) =>
    templateAreas[isError ? 'withError' : 'default']};
  grid-column-gap: 0;
  grid-row-gap: 16px;
  min-height: 100vh;
  height: auto;
`;

export const LayoutTitleStyle = styled((props) => <H1 {...props} />)`
  font-weight: 800;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  margin-bottom: 0.2em;
  line-height: 1.2em;
  text-align: center;

  &:empty {
    display: none;
  }
`;

export const LayoutSubTitleStyle = styled.h4`
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
