import styled from 'styled-components';

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

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spaceMap.sm}px;
  }
`;

export const ScrollableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
`;
