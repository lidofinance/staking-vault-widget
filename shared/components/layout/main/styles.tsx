import styled from 'styled-components';
import { Container, ContainerProps } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';

export const MainStyle = styled(Container)<ContainerProps>`
  grid-area: content;
  position: relative;
  padding-top: 0;
  padding-bottom: ${({ theme }) => theme.spaceMap.sm}px;

  @media ${devicesHeaderMedia.mobile} {
    padding: 0;
  }
`;
