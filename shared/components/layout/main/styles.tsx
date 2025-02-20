import { Container, ContainerProps } from '@lidofinance/lido-ui';
import styled from 'styled-components';

export const MainStyle = styled(Container)<ContainerProps>`
  grid-area: content;
  position: relative;
  padding-top: 0;
  padding-bottom: ${({ theme }) => theme.spaceMap.sm}px;
`;
