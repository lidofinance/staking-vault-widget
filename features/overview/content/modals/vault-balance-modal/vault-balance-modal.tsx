import { Text } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { DATA_UNAVAILABLE } from 'consts/text';
import { InlineLoader } from 'shared/components';
import { formatCustomDate } from 'utils/formats';

import { OverviewModal } from 'features/overview/shared';

export const VaultBalanceModal = () => {
  const { data, isPending, error } = useVault();

  return (
    <OverviewModal
      name="balance"
      symbol="ETH"
      amountRightDecorator={
        <InlineLoader isLoading={isPending}>
          <Text size="xxs" color="secondary">
            Updated:{' '}
            {data && formatCustomDate(Number(data.hubReport.timestamp))}
            {error && DATA_UNAVAILABLE}
          </Text>
        </InlineLoader>
      }
    />
  );
};
