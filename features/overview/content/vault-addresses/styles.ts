import styled from 'styled-components';
import { H2 } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const Container = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const Content = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;

  @media ${devicesHeaderMedia.mobile} {
    grid-template-columns: 1fr;
  }
`;

export const Title = styled(H2)`
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: 24px;
`;
