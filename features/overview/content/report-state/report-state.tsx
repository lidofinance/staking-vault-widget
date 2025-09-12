import { Text } from '@lidofinance/lido-ui';

import { CID_TO_GATEWAY, useVault } from 'modules/vaults';
import { DATA_UNAVAILABLE } from 'consts/text';

import { formatCustomDate } from 'features/overview/consts';

import {
  InlineLoaderStyled,
  ReportStateContainer,
  StyledLink,
  TextWrapper,
} from './styles';

export const ReportState = () => {
  const { data, isPending, error } = useVault();

  return (
    <ReportStateContainer data-testid="reportSection">
      {isPending ? (
        <InlineLoaderStyled />
      ) : (
        <TextWrapper>
          <Text color="secondary" size="xxs" data-testid="reportData">
            Last updated:{' '}
            {data && formatCustomDate(Number(data.hubReport.timestamp))}
            {error && DATA_UNAVAILABLE}
          </Text>
          {data && (
            <StyledLink
              target="_blank"
              href={CID_TO_GATEWAY[0](data.hubReport.cid)}
              data-testid="reportLink"
            >
              View oracle report
            </StyledLink>
          )}
        </TextWrapper>
      )}
    </ReportStateContainer>
  );
};
