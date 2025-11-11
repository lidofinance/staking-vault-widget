import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  max-width: 806px;
  min-width: 540px;
  margin: 0 auto;
`;

export const ErrorState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.lg}px;
`;

export const OverviewContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const Content = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  max-width: 868px;
  width: 100%;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spaceMap.xl}px;

  @media ${devicesHeaderMedia.tablet} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;
