import { Text } from '@lidofinance/lido-ui';
import { usePublicClient } from 'wagmi';

import { useVault } from 'modules/vaults';
import { formatCustomDate } from 'utils';

import { DescriptionLoader } from '../description-loader';

const getChainPeriod = (chainId: number) => {
  if (chainId === 1) {
    return 43200n; // 12h in seconds
  }
  return 86400n; // 24h in seconds
};

const getTime = (timestamp: bigint) => formatCustomDate(Number(timestamp));

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
      <Text size="xs">{getText(isReportFresh, timestamp, chainId)}</Text>
    </DescriptionLoader>
  );
};
