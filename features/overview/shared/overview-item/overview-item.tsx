import { FC } from 'react';

import { Question, Text, Tooltip } from '@lidofinance/lido-ui';
import { ItemWrapper, Title } from './styles';

export interface ItemProps {
  title: string;
  content: string;
  isSuccess?: boolean;
}

export const OverviewItem: FC<ItemProps> = (props) => {
  const { title, content, isSuccess } = props;
  const contentColor = isSuccess ? 'success' : 'default';

  return (
    <ItemWrapper>
      <Title>
        <Text color="secondary" size="xxs">
          {title}
        </Text>
        <Tooltip title="Lorem ipsum">
          <Question />
        </Tooltip>
      </Title>
      <Text size="lg" color={contentColor} strong>
        {content}
      </Text>
    </ItemWrapper>
  );
};
