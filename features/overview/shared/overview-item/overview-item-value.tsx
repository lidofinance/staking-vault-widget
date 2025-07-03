import React, { FC } from 'react';
import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { LoaderWrapper, ValueWrapper } from './styles';

export type ItemValueProps = {
  content: string | number | undefined;
  extraContent?: React.ReactNode;
  isLoading?: boolean;
  color?: string;
};

export const OverviewItemValue: FC<ItemValueProps> = ({
  content,
  extraContent,
  isLoading,
  color,
}) => {
  return (
    <>
      {isLoading ? (
        <LoaderWrapper>
          <InlineLoader />
        </LoaderWrapper>
      ) : (
        <ValueWrapper>
          <Text size="lg" style={{ color }} strong>
            {content ? (
              <>
                {content}
                {extraContent}
              </>
            ) : (
              '-'
            )}
          </Text>
        </ValueWrapper>
      )}
    </>
  );
};
