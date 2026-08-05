import { Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';

import { DescriptionLoader } from '../description-loader';
import { usePublicClient } from 'wagmi';

const getChainPeriod = (chainId: number) => {
  if (chainId === 1) {
    return 43200n; // 12h in seconds
  }
  return 86400n; // 24h in seconds
};

const getTime = (timestamp: bigint) => {
  const now = Date.now();
  const targetMs = Number(timestamp) * 1000;

  // safe border
  if (now >= targetMs) {
    return 'soon';
  }

  // contract timestamp in seconds
  const date = new Date(Number(timestamp) * 1000);

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'UTC',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const parts = formatter.formatToParts(date);
  const values: Record<string, string> = {};
  for (const { type, value } of parts) {
    values[type] = value;
  }

  return `${values.day}.${values.month}.${values.year} at ${values.hour}:${values.minute}:${values.second} UTC`;
};

const getText = (
  isReportFresh: boolean,
  timestamp: bigint,
  chainId: number,
) => {
  if (isReportFresh) {
    const nextReportTimestamp = timestamp + getChainPeriod(chainId);
    return `Now, you need to wait for next Oracle report to proceed with disconnection. The next Oracle report is expected on ${getTime(nextReportTimestamp)}.`;
  }

  return `Latest Oracle report is from ${getTime(timestamp)}. Now, you need to apply this report to the stVault to proceed with disconnection.`;
};

export const Description = () => {
  const { isLoading, activeVault } = useVault();
  const client = usePublicClient();
  const chainId = client.chain.id;
  const { isReportFresh = false, hubReport } = activeVault ?? {};
  const timestamp = hubReport?.timestamp ?? 0n;

  return (
    <DescriptionLoader isLoading={isLoading}>
      <Text size="xs" data-testid="description">
        {getText(isReportFresh, timestamp, chainId)}
      </Text>
    </DescriptionLoader>
  );
};
