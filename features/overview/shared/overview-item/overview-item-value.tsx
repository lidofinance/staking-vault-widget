import { FC } from 'react';
import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { LoaderWrapper, ValueWrapper } from './styles';

export interface ItemValueProps {
  content: string | number | undefined;
  isLoading?: boolean;
  color?: string;
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isLoading, color } = props;

  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <InlineLoader />
        </LoaderWrapper>
      ) : (
        <ValueWrapper>
          <Text size="lg" style={{ color }} strong>
            {content ?? '-'}
          </Text>
        </ValueWrapper>
      )}
    </>
  );
};
