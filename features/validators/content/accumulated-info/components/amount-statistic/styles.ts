import styled from 'styled-components';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.article`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;

export const StatisticWrapper = styled.article`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.md}px;

  @media ${devicesHeaderMedia.mobile} {
    flex-direction: column;
    gap: ${({ theme }) => theme.spaceMap.xl}px;
  }
`;
