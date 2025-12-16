import styled from 'styled-components';
import { Block } from '@lidofinance/lido-ui';

export const PopoverContent = styled(Block)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: 0;
`;

export const ActionGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  align-items: center;
`;
