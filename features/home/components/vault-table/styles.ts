import type { ComponentProps } from 'react';
import styled, { css } from 'styled-components';
import { Table, Thead, Tbody, Tr, Th, Td } from '@lidofinance/lido-ui';

export const TableTitle = styled.caption<{ counter?: number }>`
  position: relative;
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
  text-align: left;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  line-height: 38px;
  user-select: none;

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
  overflow: hidden;
`;

export const TableHead = styled(Thead)`
  border-top: 0;
`;

export const TableBody = styled(Tbody)`
  position: relative;
`;
export const TableHeaderCell = styled(Th)`
  padding: 24px 0 16px;
  text-align: center;

  & > div {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  &:first-child {
    text-align: left;
  }

  &:last-child {
    text-align: right;
  }
`;

export const TableRow = styled(Tr)<Pick<ComponentProps<typeof Tr>, 'onClick'>>`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 24px;
  border: 0;

  &:before,
  &:after {
    border: 0 !important;
  }

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
      &:hover {
        background-color: var(--lido-color-accentBorder);
      }
    `}

  &:has(td):nth-child(odd):not(:hover) {
    background-color: var(--custom-background-secondary);
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
