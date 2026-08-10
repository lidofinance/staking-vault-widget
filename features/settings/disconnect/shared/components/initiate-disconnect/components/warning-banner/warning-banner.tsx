import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';
import { BannerWithoutTitle } from 'shared/components';

import { useCheckAvailability } from '../../hooks';

export const WarningBanner = () => {
  const { isLoading, isError, isNeedSupplyForFees, hasMintedStETH } =
    useCheckAvailability();

  if (isLoading || isError || isNeedSupplyForFees || hasMintedStETH) {
    return null;
  }

  return (
    <BannerWithoutTitle
      leftDecorator={<WarningRing />}
      padding="16px"
      dataTestId="warning-banner"
    >
      <Text size="xxs">
        This process is one-way. Once the disconnection is initiated, it must be
        completed. The 1 ETH deposit is unlocked only after the process is fully
        completed. The stVault can be reconnected to VaultHub if it has not been
        ossified.
      </Text>
    </BannerWithoutTitle>
  );
};
