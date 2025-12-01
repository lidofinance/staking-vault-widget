import { Fragment } from 'react';
import type { ComponentProps } from 'react';
import styled from 'styled-components';

import { Question, Tooltip } from '@lidofinance/lido-ui';

const QuestionIcon = styled(Question)`
  min-width: 20px;
  min-height: 20px;
  fill: ${({ theme }) => theme.colors.textSecondary};
  align-self: baseline;
  vertical-align: text-bottom;
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

  if (typeof text === 'string') {
    text = text.split('\n').map((line, index, array) => (
      <Fragment key={index}>
        {line}
        {index !== array.length - 1 && <br />}
      </Fragment>
    ));
  }

  return (
    <Tooltip title={text} placement={placement}>
      <QuestionIcon {...rest} />
    </Tooltip>
  );
};
