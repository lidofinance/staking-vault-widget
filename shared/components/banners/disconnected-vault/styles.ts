import styled from 'styled-components';
import { Heading } from '@lidofinance/lido-ui';

export const Wrapper = styled.article`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: ${({
    theme: {
      colors: { textSecondary },
    },
  }) => `color-mix(in display-p3, ${textSecondary} 10%, transparent)`};
`;

export const Title = styled(Heading)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;
