import styled from 'styled-components';
import { Question } from '@lidofinance/lido-ui';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const StEthQuestion = styled(Question)`
  cursor: pointer;

  &:hover {
    fill: var(--lido-color-text);
  }
`;
