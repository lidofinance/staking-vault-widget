import styled from 'styled-components';
import { Heading, Button, Theme } from '@lidofinance/lido-ui';

type WrapperProps = {
  type: 'warning' | 'error' | 'info';
  theme: Theme;
};

const getBackgroundColor = ({ type, theme }: WrapperProps) => {
  if (type !== 'info') {
    return `color-mix(in display-p3, ${theme.colors[type]} 20%, transparent)`;
  }

  return `color-mix(in display-p3, ${theme.colors.textSecondary} 10%, transparent)`;
};

export const Wrapper = styled.section<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spaceMap.md}px;
  padding: ${({ theme }) => theme.spaceMap.md}px;
  border-radius: 12px;
  background-color: ${getBackgroundColor};
`;

export const Title = styled(Heading)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
  margin-bottom: ${({ theme }) => theme.spaceMap.sm}px;
  font-size: ${({ theme }) => theme.fontSizesMap.sm}px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.text};
`;

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
