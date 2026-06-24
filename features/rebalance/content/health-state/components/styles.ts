import styled from 'styled-components';
import { Theme } from '@lidofinance/lido-ui';

import { devicesHeaderMedia } from 'styles/global';
import { isNumber, getHealthFactorColor } from 'utils';

const getRatioIndicatorColor = ({
  theme,
  $ratio,
}: {
  theme: Theme;
  $ratio: number | undefined;
}) => {
  const { success, error, text } = theme.colors;
  if (!isNumber($ratio)) {
    return text;
  }

  return $ratio >= 100 ? error : success;
};

export const ListItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spaceMap.xs}px;

  @media ${devicesHeaderMedia.mobile} {
    justify-content: space-between;
  }
`;

export const UtilizationRatioIndicator = styled.span<{
  $ratio: number | undefined;
}>`
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: ${getRatioIndicatorColor};
`;

export const HealthFactorIndicator = styled.span<{ $indicator: number }>`
  font-size: 12px;
  font-weight: 700;
  line-height: 20px;
  color: ${({ $indicator }) => getHealthFactorColor($indicator)};
`;
