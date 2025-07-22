import { Text } from '@lidofinance/lido-ui';

import { CID_TO_GATEWAY, useVault } from 'modules/vaults';
import { DATA_UNAVAILABLE } from 'consts/text';

import {
  InlineLoaderStyled,
  ReportStateContainer,
  StyledLink,
  TextWrapper,
} from './styles';

const formatCustomDate = (timestampSeconds: number): string => {
  const date = new Date(timestampSeconds * 1000);

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: false,
    timeZoneName: 'shortOffset',
  });
  return formatter.format(date);
};

export const ReportState = () => {
  const { data, isPending, error } = useVault();

  return (
    <ReportStateContainer>
      {isPending ? (
        <InlineLoaderStyled />
      ) : (
        <TextWrapper>
          <Text color="secondary" size="xxs">
            Last updated:{' '}
            {data && formatCustomDate(Number(data.hubReport.timestamp))}
            {error && DATA_UNAVAILABLE}
          </Text>
          {data && (
            <StyledLink
              target="_blank"
              href={CID_TO_GATEWAY[0](data.hubReport.cid)}
            >
              View oracle report
            </StyledLink>
          )}
        </TextWrapper>
      )}
    </ReportStateContainer>
  );
};
