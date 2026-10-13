import styled from 'styled-components';
import type { Theme } from '@lidofinance/lido-ui';

import { getColorTransparency } from 'styles';

type BackgroundType = 'warning' | 'danger';

const getBackgroundColor = ({
  theme,
  $type,
}: {
  $type: BackgroundType;
  theme: Theme;
}) => {
  const { warning, error } = theme.colors;
  const colorMap: Record<BackgroundType, string> = {
    warning,
    danger: error,
  };

  return getColorTransparency(colorMap[$type], '10%');
};

export const Container = styled.div<{ $type: 'warning' | 'danger' }>`
  display: flex;
  align-items: center;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 8px;
  background-color: ${getBackgroundColor};
`;

export const IconWrapper = styled.div`
  width: 24px;
  height: 24px;
`;
