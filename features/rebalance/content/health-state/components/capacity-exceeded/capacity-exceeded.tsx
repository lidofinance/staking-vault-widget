import { Text } from '@lidofinance/lido-ui';

import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { isNumber } from 'utils';
import { UTILIZATION_RATIO_THRESHOLD } from 'consts/threshold';

import { InfoBanner } from 'features/rebalance/shared';

export const CapacityExceeded = () => {
  const { data, isLoading } = useVaultOverviewData();
  const { utilizationRatioNumber, healthFactorNumber } = data ?? {};

  if (
    isLoading ||
    !isNumber(utilizationRatioNumber) ||
    !isNumber(healthFactorNumber) ||
    utilizationRatioNumber < UTILIZATION_RATIO_THRESHOLD ||
    healthFactorNumber < 100
  ) {
    return null;
  }

  return (
    <InfoBanner data-testid="capacity-exceeded-banner">
      <Text size="xxs" color="warning" strong>
        {vaultTexts.actions.rebalance.healthState.capacityExceeded}
      </Text>
    </InfoBanner>
  );
};
