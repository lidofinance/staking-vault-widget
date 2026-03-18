import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatCustomDate } from 'utils/formats';
import { InlineLoader } from 'shared/components';

import { ReindexStateContainer, TextWrapper } from './styles';

type ReindexStateProps = {
  nextUpdateAt: Date | undefined;
  isLoading: boolean;
};

export const ReindexState: FC<ReindexStateProps> = ({
  nextUpdateAt,
  isLoading,
}) => {
  if (!nextUpdateAt) return null;

  return (
    <InlineLoader isLoading={isLoading} width={140}>
      <ReindexStateContainer data-testid="reindexVaultsSection">
        <TextWrapper>
          <Text color="secondary" size="xxs" data-testid="reindexVaultsData">
            The stVaults list will refresh on{' '}
            {formatCustomDate(nextUpdateAt.getTime())}
          </Text>
        </TextWrapper>
      </ReindexStateContainer>
    </InlineLoader>
  );
};
