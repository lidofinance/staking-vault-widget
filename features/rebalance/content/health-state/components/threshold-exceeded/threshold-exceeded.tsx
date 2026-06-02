import { Text } from '@lidofinance/lido-ui';

import { useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { isNumber } from 'utils';

import { InfoBanner } from 'features/rebalance/shared';

export const ThresholdExceeded = () => {
  const { data, isLoading } = useVaultOverviewData();

  const { healthFactorNumber } = data ?? {};

  if (isLoading || !isNumber(healthFactorNumber) || healthFactorNumber >= 100) {
    return null;
  }

  return (
    <InfoBanner type="danger">
      <Text size="xxs" color="error" strong>
        {vaultTexts.actions.rebalance.healthState.thresholdExceeded}
      </Text>
    </InfoBanner>
  );
};
