import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const GroupWrapper = styled.article`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Title = styled(Text)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
