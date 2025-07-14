import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const Content = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  max-width: 868px;
  width: 100%;
  margin: 0 auto;

  @media ${devicesHeaderMedia.tablet} {
    padding: ${({ theme }) => theme.spaceMap.md}px;
  }
`;

export const OverviewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;
