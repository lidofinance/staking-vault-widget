import { useVaultOverviewData } from 'modules/vaults';

import { getRebalanceMode } from 'features/rebalance/shared/get-rebalance-mode';

export const useRebalanceMode = () => {
  const { data } = useVaultOverviewData();

  return getRebalanceMode({
    healthFactorNumber: data?.healthFactorNumber,
    utilizationRatioNumber: data?.utilizationRatioNumber,
  });
};
