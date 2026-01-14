import styled from 'styled-components';
import { Text, Button } from '@lidofinance/lido-ui';

export const Wrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.lg}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: color-mix(
    in display-p3,
    ${({ theme }) => theme.colors.warning} 20%,
    transparent
  );
`;

export const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;

export const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  flex-grow: 1;
`;

export const ListOfUpdates = styled.div`
  display: flex;
  flex-direction: column;
`;

export const TextStyled = styled(Text)`
  line-height: 20px;
`;

export const ModalButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.foreground};
`;
