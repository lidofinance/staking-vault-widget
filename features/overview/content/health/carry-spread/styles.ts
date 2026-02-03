import styled from 'styled-components';
import { Text, TextProps, Theme } from '@lidofinance/lido-ui';
import { isNumber } from 'utils';

type InjectedProps = {
  size: 'xxs' | 'xs' | 'sm' | 'md' | 'lg';
  $percent: number | undefined;
  theme: Theme;
} & Omit<TextProps, 'size' | 'strong'>;

const getTextColor = ({ theme: { colors }, $percent }: InjectedProps) => {
  if (!isNumber($percent)) {
    return 'transparent';
  }
  return $percent > 0 ? '#53BA95' : colors.error;
};

export const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
  width: 100%;
`;

export const ChartContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  // fixing height sibling chart
  height: 24px;
`;

export const CarrySpreadPercent = styled(Text)<InjectedProps>`
  color: ${getTextColor};
`;
