import { FC } from 'react';
import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { LoaderWrapper, ValueWrapper } from './styles';

export interface ItemValueProps {
  content: string | number | undefined | boolean;
  isLoading?: boolean;
  color?: string;
  textSize?: 'lg' | 'xl';
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isLoading, color, textSize = 'xl' } = props;

  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <InlineLoader />
        </LoaderWrapper>
      ) : (
        <ValueWrapper>
          <Text size={textSize} style={{ color }} strong>
            {content ?? '-'}
          </Text>
        </ValueWrapper>
      )}
    </>
  );
};
