import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const StatisticContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const Title = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const TitleText = styled(Text)`
  line-height: 20px;
`;
