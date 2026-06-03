import { useVaultOverviewData } from 'modules/vaults';
import { isNumber } from 'utils';

export const useIsForceRebalance = () => {
  const { data } = useVaultOverviewData();
  const { healthFactorNumber } = data ?? {};

  return isNumber(healthFactorNumber) && healthFactorNumber < 100;
};
