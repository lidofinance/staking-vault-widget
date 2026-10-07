import type { FC, ReactNode } from 'react';
import { Tooltip, TextColors } from '@lidofinance/lido-ui';

import { QuestionIcon } from './styles';

type TooltipHintProps = {
  hint: ReactNode;
  color?: TextColors;
  size?: number;
};

export const TooltipHint: FC<TooltipHintProps> = ({
  hint,
  color = 'secondary',
  size = 24,
}) => {
  return (
    <Tooltip title={hint}>
      <QuestionIcon $color={color} width={size} height={size} />
    </Tooltip>
  );
};
