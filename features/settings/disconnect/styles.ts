import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

export const DisconnectPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  width: 100%;
`;

export const Title = styled(Heading)`
  font-size: ${({ theme }) => theme.fontSizesMap.lg}px;
  line-height: 28px;
  color: ${({ theme }) => theme.colors.text};
`;

export const Content = styled.div`
  display: flex;
  flex-direction: column;
`;
