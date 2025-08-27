import { Text, InlineLoader } from '@lidofinance/lido-ui';

import { useVault } from 'modules/vaults';
import { DATA_UNAVAILABLE } from 'consts/text';

import { OverviewModal } from 'features/overview/shared';
import { formatCustomDate } from 'features/overview/consts';

export const VaultBalanceModal = () => {
  const { data, isPending, error } = useVault();

  return (
    <OverviewModal
      name="balanceEth"
      amountRightDecorator={
        <>
          {isPending ? (
            <InlineLoader />
          ) : (
            <Text size="xxs" color="secondary">
              Updated:{' '}
              {data && formatCustomDate(Number(data.hubReport.timestamp))}
              {error && DATA_UNAVAILABLE}
            </Text>
          )}
        </>
      }
    />
  );
};
