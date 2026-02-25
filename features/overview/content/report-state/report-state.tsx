import { Text } from '@lidofinance/lido-ui';

import { CID_TO_GATEWAY, useVault } from 'modules/vaults';
import { DATA_UNAVAILABLE } from 'consts/text';
import { InlineLoader } from 'shared/components';

import { formatCustomDate } from 'features/overview/consts';

import { ReportStateContainer, StyledLink } from './styles';

export const ReportState = () => {
  const { data, isPending, error, activeVault } = useVault();

  if (activeVault?.isPendingConnect) {
    return null;
  }

  return (
    <ReportStateContainer data-testid="reportSection">
      <InlineLoader isLoading={isPending} width={140}>
        <Text color="secondary" size="xxs" data-testid="reportData">
          Metrics are based on simulated report data. Last updated:{' '}
          {data && (
            <>
              {formatCustomDate(Number(data.hubReport.timestamp))}{' '}
              <StyledLink
                target="_blank"
                href={CID_TO_GATEWAY[0](data.hubReport.cid)}
                data-testid="reportLink"
              >
                View oracle report
              </StyledLink>
            </>
          )}
          {error && DATA_UNAVAILABLE}
        </Text>
      </InlineLoader>
    </ReportStateContainer>
  );
};
