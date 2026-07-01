import type { FC, ReactNode } from 'react';
import { Tooltip, TextColors } from '@lidofinance/lido-ui';

import { QuestionIcon } from './styles';

type TooltipHintProps = {
  hint: ReactNode;
  color?: TextColors;
};

export const TooltipHint: FC<TooltipHintProps> = ({
  hint,
  color = 'secondary',
}) => {
  return (
    <Tooltip title={hint}>
      <QuestionIcon $color={color} />
    </Tooltip>
  );
};
