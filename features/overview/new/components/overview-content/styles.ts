import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const OverviewWrapper = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
  max-width: 868px;
  width: 100%;
  margin: 0 auto;
`;
