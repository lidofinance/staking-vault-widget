import styled from 'styled-components';

type WithdrawChartColor = 'withdrawable' | 'notWithdrawable';

const healthChartColorMap: Record<WithdrawChartColor, `#${string}`> = {
  withdrawable: '#00A3FF',
  notWithdrawable: '#B35FE0',
};

const getColor = ({ color }: { color: WithdrawChartColor }) => {
  return healthChartColorMap[color];
};

export const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spaceMap.sm}px;
`;

export const ListItem = styled.div<{ color: WithdrawChartColor }>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  position: relative;
  padding-left: ${({ theme }) => theme.spaceMap.md}px;

  &::before {
    position: absolute;
    top: 50%;
    left: 0;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    content: '';
    background-color: ${getColor};
    transform: translateY(-50%);
  }
`;

export const ChartHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: end;
  text-align: left;
  gap: ${({ theme }) => theme.spaceMap.xs}px;
`;
