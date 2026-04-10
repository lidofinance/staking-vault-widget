import styled from 'styled-components';
import { Table, Tbody, Tr, Th } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  align-items: center;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;

export const ScrollableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TableStyled = styled(Table)`
  width: 100%;
  background-color: var(--lido-color-foreground);
  overflow: clip;
  border-collapse: collapse;
`;

export const TableBody = styled(Tbody)`
  position: relative;
`;

export const TableHeaderCell = styled(Th)`
  padding: ${({ theme }) => theme.spaceMap.sm}px 12px;
  text-align: left;
  border-top: 0;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
`;

export const TableRow = styled(Tr)`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 24px;
  border: 0;
  background-color: ${({ theme }) => theme.colors.foreground};

  &:before,
  &:after {
    width: 0 !important;
    border-top: 0 !important;
  }

  @media ${devicesHeaderMedia.mobile} {
    & td:first-child,
    & th:first-child {
      padding-left: ${({ theme }) => theme.spaceMap.sm}px;
    }

    & td:last-child,
    & th:last-child {
      padding-right: ${({ theme }) => theme.spaceMap.sm}px;
    }
  }
`;

export const SpacerRow = styled(Tr).attrs({ ariaHidden: true })`
  height: 128px;
  background-color: ${({ theme }) =>
    theme.name === 'light' ? `#F7F9FB` : `rgba(0, 0, 0, 0.2)`};
  & > * {
    opacity: 0;
    pointer-events: none;
  }
`;

export const NonTableRow = styled(Tr)<{ overlay?: boolean }>`
  position: absolute;
  z-index: 100;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ overlay, theme }) =>
    overlay
      ? theme.name === 'light'
        ? `rgba(255, 255, 255, 0.8)`
        : `rgba(0, 0, 0, 0.2)`
      : 'unset'};

  & > td {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;
