import styled from 'styled-components';
import { Question } from '@lidofinance/lido-ui';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const AmountInfo = styled.p`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  color: ${({ theme }) => theme.colors.text};
`;

export const StEthQuestion = styled(Question)`
  cursor: pointer;

  &:hover {
    fill: var(--lido-color-text);
  }
`;
