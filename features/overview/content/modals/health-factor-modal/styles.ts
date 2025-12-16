import styled from 'styled-components';

type HealthChartColor = 'rebalance' | 'danger' | 'warning' | 'success';

const healthChartColorMap: Record<HealthChartColor, `var(--${string})`> = {
  rebalance: 'var(--chart-health-rebalance)',
  danger: 'var(--chart-health-danger)',
  warning: 'var(--chart-health-warning)',
  success: 'var(--chart-health-success)',
};

const getColor = ({ color }: { color: HealthChartColor }) => {
  return healthChartColorMap[color];
};

export const List = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.md}px;
`;

export const ListItem = styled.div<{ color: HealthChartColor }>`
  position: relative;
  padding-left: 12px;
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  line-height: 20px;
  color: ${({ theme }) => theme.colors.text};

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    content: '';
    background-color: ${getColor};
    transform: translateY(-50%);
  }
`;

export const HealthFactorHint = styled.span<{ color: HealthChartColor }>`
  font-size: ${({ theme }) => theme.fontSizesMap.xxs}px;
  color: ${getColor};
`;

export const ChartContainer = styled.div`
  margin-top: 24px;
`;
