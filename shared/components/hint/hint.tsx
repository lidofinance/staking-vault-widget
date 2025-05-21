import type { ComponentProps } from 'react';
import styled from 'styled-components';

import { Question, Tooltip } from '@lidofinance/lido-ui';

const QuestionIcon = styled(Question)`
  width: 20px;
  height: 20px;
  fill: ${({ theme }) => theme.colors.textSecondary};
  align-self: center;
`;

type TooltipProps = ComponentProps<typeof Tooltip>;

type HintProps = {
  text?: TooltipProps['title'];
  placement?: TooltipProps['placement'];
} & ComponentProps<typeof QuestionIcon>;

export const Hint = ({ text, placement = 'topLeft', ...rest }: HintProps) => {
  if (!text) {
    return null;
  }

  return (
    <Tooltip title={text} placement={placement}>
      <QuestionIcon {...rest} />
    </Tooltip>
  );
};
