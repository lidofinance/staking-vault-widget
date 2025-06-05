import styled from 'styled-components';
import { Question } from '@lidofinance/lido-ui';

export const Wrapper = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const StEthQuestion = styled(Question)`
  cursor: pointer;

  &:hover {
    fill: var(--lido-color-text);
  }
`;

export { InfoRow } from '../balance/styles';
