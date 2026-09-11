import { Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { DATA_UNAVAILABLE } from 'consts/text';
import { InlineLoader } from 'shared/components';
import { formatCustomDate } from 'utils/formats';

// Timestamp of the oracle report the modal amounts are derived from.
export const ReportUpdatedAt = () => {
  const { data, isPending, error } = useVault();

  return (
    <InlineLoader isLoading={isPending}>
      <Text size="xxs" color="secondary" data-testid="reportUpdatedAt">
        Updated: {data && formatCustomDate(Number(data.hubReport.timestamp))}
        {error && DATA_UNAVAILABLE}
      </Text>
    </InlineLoader>
  );
};
