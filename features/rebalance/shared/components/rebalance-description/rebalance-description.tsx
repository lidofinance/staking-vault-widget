import { useVaultOverviewData } from 'modules/vaults';
import { InlineLoader } from 'shared/components';
import { isNumber } from 'utils';

import { Rebalance } from './rebalance';
import { ForceRebalance } from './force-rebalance';

export const RebalanceDescription = () => {
  const { isPending, data } = useVaultOverviewData();
  const { healthFactorNumber } = data ?? {};

  return (
    <InlineLoader isLoading={isPending} height={88}>
      {isNumber(healthFactorNumber) && healthFactorNumber >= 100 ? (
        <Rebalance />
      ) : (
        <ForceRebalance />
      )}
    </InlineLoader>
  );
};
