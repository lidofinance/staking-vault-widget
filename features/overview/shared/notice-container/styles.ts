import styled from 'styled-components';
import { Heading, Text, Theme } from '@lidofinance/lido-ui';

type WrapperProps = {
  type: 'warning' | 'error' | 'info';
  theme: Theme;
};

const getBackgroundColor = ({ type, theme }: WrapperProps) => {
  if (type === 'warning') {
    return '#FEF2E1';
  }

  if (type !== 'info') {
    return `color-mix(in display-p3, ${theme.colors[type]} 20%, transparent)`;
  }

  return `color-mix(in display-p3, ${theme.colors.textSecondary} 10%, transparent)`;
};

export const Wrapper = styled.section<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: ${getBackgroundColor};
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const Title = styled(Heading)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  font-size: ${({ theme }) => theme.fontSizesMap.xs}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

export const TextStyled = styled(Text)`
  line-height: 20px;
`;
