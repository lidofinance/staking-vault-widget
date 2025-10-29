import type { FC } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { formatCustomDate } from 'features/overview/consts';

import {
  InlineLoaderStyled,
  ReindexStateContainer,
  TextWrapper,
} from './styles';

type ReindexStateProps = {
  nextUpdateAt: Date | undefined;
  isLoading: boolean;
};

export const ReindexState: FC<ReindexStateProps> = ({
  nextUpdateAt,
  isLoading,
}) => {
  if (!nextUpdateAt && !isLoading) {
    return null;
  }

  return (
    <ReindexStateContainer data-testid="reindexVaultsSection">
      {isLoading && <InlineLoaderStyled />}
      {nextUpdateAt && (
        <TextWrapper>
          <Text color="secondary" size="xxs" data-testid="reindexVaultsData">
            Next update at: {formatCustomDate(nextUpdateAt.getTime())}
          </Text>
        </TextWrapper>
      )}
    </ReindexStateContainer>
  );
};
