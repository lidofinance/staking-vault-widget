import styled from 'styled-components';
import { Text } from '@lidofinance/lido-ui';

export const HintContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  width: 194px;
  padding: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const HintText = styled(Text)`
  color: var(--lido-color-accentContrast);
  line-height: 20px;
`;
