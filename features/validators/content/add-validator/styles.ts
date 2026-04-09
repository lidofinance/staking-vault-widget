import styled from 'styled-components';
import { Button } from '@lidofinance/lido-ui';

export const Content = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xl}px;
`;

export const TextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const ButtonStyled = styled(Button)`
  min-width: 122px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
`;
