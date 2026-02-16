import styled, { css } from 'styled-components';
import { Table, Tbody, Tr, Th, Td } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const TableContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  align-items: center;
`;

export const ScrollableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;

export const TableTitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spaceMap.sm}px;
  }
`;

export const TableTitle = styled.div<{ counter?: number }>`
  position: relative;
  text-align: left;
  align-self: flex-start;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  line-height: 38px;

  &::after {
    position: absolute;
    min-width: 30px;
    left: 100%;
    top: 50%;
    content: ${(props) => (props.counter ? `'${props.counter}'` : 'none')};
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 10px;
    margin-left: 12px;
    border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
    font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
    font-weight: normal;
    line-height: 20px;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textSecondary};
    background-color: ${({ theme }) =>
      theme.name === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(0, 0, 0, 0.1)'};
  }
`;

export const TableStyled = styled(Table)`
  position: relative;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-foreground);
  overflow: clip;
`;

export const TableBody = styled(Tbody)`
  position: relative;
`;

export const TableHeaderCell = styled(Th)`
  padding: 24px 2px 16px;
  text-align: right;
  border-top: 0;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;

  &:first-child {
    text-align: left;
  }

  & > div {
    display: flex;
    align-items: center;
  }
`;

export const TableRow = styled(Tr)`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 24px;
  border: 0;

  &:before,
  &:after {
    border-top: 0 !important;
  }

  ${({ onClick, theme }) =>
    onClick &&
    css`
      cursor: pointer;
      &:hover {
        background-color: ${theme.name === 'light'
          ? '#edeff3'
          : 'var(--lido-color-accentBorder)'};
      }
    `}

  &:has(td):nth-child(odd):not(:hover) {
    background-color: var(--custom-background-secondary);
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

export const TableCell = styled(Td)<{ fontSize?: string }>`
  border: 0;
  font-size: ${({ theme, fontSize }) => fontSize ?? theme.fontSizesMap.xs}px;
  padding: 12px;

  &:before,
  &:after {
    border: 0;
  }

  &:first-of-type {
    text-align: start;
  }

  &:last-of-type {
    text-align: end;
  }
`;
