import styled from 'styled-components';
import { Table, Thead, Tr, Th } from '@lidofinance/lido-ui';

export const TableTitle = styled.caption<{ counter: number }>`
  position: relative;
  width: fit-content;
  margin-bottom: ${({ theme }) => theme.spaceMap.md}px;
  text-align: left;
  font-weight: 700;
  font-size: ${({ theme }) => theme.fontSizesMap.xl}px;
  line-height: 1.4em;
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
    line-height: 1.6em;
    background-color: rgba(
      39,
      39,
      46,
      0.1
    ); // TODO: get bg-color for dark/light theme;
    color: ${({ theme }) => theme.colors.textSecondary};
    transform: translateY(-50%);
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

  & > div {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

export const TableRow = styled(Tr)`
  border: 0;

  &:before,
  &:after {
    border: 0 !important;
  }

  &:has(td):nth-child(odd) {
    background-color: var(--custom-background-secondary);
  }
`;
