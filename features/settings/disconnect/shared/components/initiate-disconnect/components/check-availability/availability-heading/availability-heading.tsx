import { useMemo } from 'react';
import { Text } from '@lidofinance/lido-ui';

import { InlineLoader } from 'shared/components';

import { useCheckAvailability, useValidatorsBalance } from '../../../hooks';

export const AvailabilityHeading = () => {
  const { isLoading, isNeedSupplyForFees, hasMintedStETH } =
    useCheckAvailability();
  const { isLoading: isValidatorInfoLoading, hasValidatorsBalance } =
    useValidatorsBalance();

  const canProceed = !isNeedSupplyForFees && !hasMintedStETH;

  const subText = useMemo(() => {
    if (!canProceed) return 'Complete the required steps below to continue';
    if (canProceed && hasValidatorsBalance)
      return 'Required checks have passed';
    return 'All required checks have passed';
  }, [hasValidatorsBalance, canProceed]);

  return (
    <div>
      <Text size="xs" strong>
        stVault is ready to disconnect
      </Text>
      <InlineLoader
        isLoading={isLoading || isValidatorInfoLoading}
        height={20}
        width={200}
      >
        <Text size="xxs">{subText}</Text>
      </InlineLoader>
    </div>
  );
};
