import { Text } from '@lidofinance/lido-ui';

import { REPORT_PERIOD, useVault } from 'modules/vaults';
import { formatCustomDate } from 'utils';

import { DescriptionLoader } from '../description-loader';

const getTime = (timestamp: bigint) => formatCustomDate(Number(timestamp));

const getText = (isReportFresh: boolean, timestamp: bigint) => {
  if (isReportFresh) {
    const nextReportTimestamp = timestamp + REPORT_PERIOD;
    return `Now, you need to wait for next Oracle report to proceed with disconnection. The next Oracle report is expected on ${getTime(nextReportTimestamp)}.`;
  }

  return `Latest Oracle report is from ${getTime(timestamp)}. Now, you need to apply this report to the stVault to proceed with disconnection.`;
};

export const Description = () => {
  const { isLoading, activeVault } = useVault();
  const { isReportFresh = false, hubReport } = activeVault ?? {};
  const timestamp = hubReport?.timestamp ?? 0n;

  return (
    <DescriptionLoader isLoading={isLoading}>
      <Text size="xs" data-testid="description">
        {getText(isReportFresh, timestamp)}
      </Text>
    </DescriptionLoader>
  );
};
