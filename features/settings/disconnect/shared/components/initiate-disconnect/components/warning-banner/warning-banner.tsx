import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';
import { BannerWithoutTitle } from 'shared/components';
import { useDappStatus } from 'modules/web3';

import { useCheckAvailability } from '../../hooks';

export const WarningBanner = () => {
  const { isLoading, isError, isNeedSupplyForFees, hasMintedStETH } =
    useCheckAvailability();
  const { isDappActive } = useDappStatus();

  if (
    isLoading ||
    isError ||
    isNeedSupplyForFees ||
    hasMintedStETH ||
    !isDappActive
  ) {
    return null;
  }

  return (
    <BannerWithoutTitle leftDecorator={<WarningRing />} padding="16px">
      <Text size="xxs">
        This process is one-way. Once the disconnection is initiated, it must be
        completed. The 1 ETH deposit is unlocked only after the process is fully
        completed. The stVault can be reconnected to VaultHub if it has not been
        ossified.
      </Text>
    </BannerWithoutTitle>
  );
};
