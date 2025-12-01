import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const ActionButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.background};
`;

export const ActionContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const ActionWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;
