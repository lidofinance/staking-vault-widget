import styled from 'styled-components';
import { Theme } from '@lidofinance/lido-ui';

import { getColorTransparency } from 'styles';

type Status = 'ongoing' | 'completed';

const getBackgroundColor = ({
  $status,
  theme,
}: {
  $status: Status;
  theme: Theme;
}) => {
  const colorsByStatus: Record<Status, string> = {
    ongoing: theme.colors.warning,
    completed: theme.colors.warning,
  };

  return getColorTransparency(colorsByStatus[$status], '10%');
};

export const BadgeContainer = styled.div<{ $status: Status }>`
  display: flex;
  align-items: center;
  padding: 4px 16px;
  border-radius: 99px;
  background-color: ${getBackgroundColor};
`;
