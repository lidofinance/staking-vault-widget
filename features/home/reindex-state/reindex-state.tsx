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
  return (
    <ReindexStateContainer data-testid="reindexVaultsSection">
      {isLoading && <InlineLoaderStyled />}
      {nextUpdateAt && (
        <TextWrapper>
          <Text color="secondary" size="xxs" data-testid="reindexVaultsData">
            The stVaults list will refresh on{' '}
            {formatCustomDate(nextUpdateAt.getTime())}
          </Text>
        </TextWrapper>
      )}
    </ReindexStateContainer>
  );
};
