import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const TextBlack = styled(Text)`
  color: ${({ theme }) => theme.colors.text};
`;
