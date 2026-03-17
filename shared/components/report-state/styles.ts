import styled from 'styled-components';
import { Question } from '@lidofinance/lido-ui';

export const Container = styled.div`
  display: flex;
  align-self: flex-end;
  align-items: center;
  gap: 4px;
  width: fit-content;
`;

export const QuestionIcon = styled(Question)<{ $isFresh: boolean }>`
  width: 18px;
  height: 18px;
  fill: ${({
    $isFresh,
    theme: {
      colors: { textSecondary, success },
    },
  }) => ($isFresh ? success : textSecondary)};
`;
