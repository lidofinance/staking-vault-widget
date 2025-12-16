import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: ${({ theme }) => theme.borderRadiusesMap.lg}px;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

export const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const ButtonStyled = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;
