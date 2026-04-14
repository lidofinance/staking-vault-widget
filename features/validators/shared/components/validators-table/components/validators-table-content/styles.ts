import styled from 'styled-components';
import { Table, Tbody, Tr, Th } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

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

  &:hover {
    // svg icon opacity
    --tba-opacity: 1;
  }
`;

export const TableHeaderCellContent = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
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
