import styled from 'styled-components';
import { Text, Theme } from '@lidofinance/lido-ui';

import { getColorTransparency } from 'styles';

type Status = 'ongoing' | 'completed';
type Size = 'small' | 'medium' | 'large';

const getBackgroundColor = ({
  $status,
  theme,
}: {
  $status: Status;
  theme: Theme;
}) => {
  const colorsByStatus: Record<Status, string> = {
    ongoing: theme.colors.warning,
    completed: theme.colors.textDark,
  };

  return getColorTransparency(colorsByStatus[$status], '10%');
};

const getPadding = ({ $size }: { $size: Size }) => {
  const paddingBySize: Record<Size, string> = {
    small: '2px 12px',
    medium: '4px 16px',
    large: '6px 20px',
  };

  return paddingBySize[$size];
};

export const BadgeContainer = styled.div<{ $status: Status; $size: Size }>`
  display: flex;
  align-items: center;
  padding: ${getPadding};
  border-radius: 99px;
  background-color: ${getBackgroundColor};
`;

export const CompetedText = styled(Text)`
  color: ${({ theme }) => theme.colors.textDark};

  svg {
    fill: ${({ theme }) => theme.colors.textDark};
  }
`;
