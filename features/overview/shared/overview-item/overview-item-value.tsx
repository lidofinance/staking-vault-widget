import { FC } from 'react';
import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { LoaderWrapper, ValueWrapper } from './styles';

export interface ItemValueProps {
  content: string | number | undefined;
  isLoading?: boolean;
  isSuccess?: boolean;
}

export const OverviewItemValue: FC<ItemValueProps> = (props) => {
  const { content, isSuccess, isLoading } = props;
  const contentColor = isSuccess ? 'success' : 'default';

  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <InlineLoader />
        </LoaderWrapper>
      ) : (
        <ValueWrapper>
          <Text size="lg" color={contentColor} strong>
            {content ?? '-'}
          </Text>
        </ValueWrapper>
      )}
    </>
  );
};
