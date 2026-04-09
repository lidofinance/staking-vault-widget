import styled from 'styled-components';
import { Question, TextColors, Theme } from '@lidofinance/lido-ui';

const getIconColor = ({
  theme: { colors },
  $color,
}: {
  theme: Theme;
  $color: TextColors;
}) => {
  const colorsMap: Record<TextColors, string> = {
    default: colors.text,
    secondary: colors.textSecondary,
    primary: colors.primary,
    warning: colors.warning,
    error: colors.error,
    success: colors.success,
  };

  return colorsMap[$color];
};

export const QuestionIcon = styled(Question)<{ $color: TextColors }>`
  fill: ${getIconColor};
`;
