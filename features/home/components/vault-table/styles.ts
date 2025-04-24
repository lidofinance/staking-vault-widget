import styled, { css } from 'styled-components';
import { Table, Thead, Tr, Th, ArrowBottom, Td } from '@lidofinance/lido-ui';

export const TableTitle = styled.caption<{ counter: number }>`
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
    background-color: rgba(
      39,
      39,
      46,
      0.1
    ); // TODO: get bg-color for dark/light theme;
  }
`;

export const TableStyled = styled(Table)`
  position: relative;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.xl}px;
  background-color: var(--lido-color-foreground);
`;

export const TableHead = styled(Thead)`
  border-top: 0;
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

export const TableRow = styled(Tr)`
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  font-weight: normal;
  line-height: 24px;
  border: 0;

  &:before,
  &:after {
    border: 0 !important;
  }

  &:has(td):nth-child(odd) {
    background-color: var(--custom-background-secondary);
  }
`;

export const TableCellStyled = styled(Td)<{ fontSize?: string }>`
  border: 0;
  font-size: ${({ theme, fontSize }) => fontSize ?? theme.fontSizesMap.xs}px;
  padding: 12px;
  text-align: center;

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

export const ArrowAnimated = styled(ArrowBottom)<{
  isActive: boolean;
  direction: 'asc' | 'desc';
}>`
  transition: transform 0.2s ease-in-out;
  transform: ${({ isActive, direction }) =>
    isActive && direction === 'desc' ? 'rotate(180deg)' : 'none'};
`;

const headerCell = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  text-align: center;
  user-select: none;
`;

export const CommonHeader = styled.div`
  ${headerCell};
`;

export const SortHeader = styled.div`
  ${headerCell};
  cursor: pointer;

  &:hover {
    color: var(--lido-color-primary);
  }
`;
