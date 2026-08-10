import { Text } from '@lidofinance/lido-ui';

import { ReactComponent as WarningRing } from 'assets/icons/warning-ring.svg';
import { BannerWithoutTitle } from 'shared/components';
import { useVault } from 'modules/vaults';

export const WarningBanner = () => {
  const { isLoading, activeVault } = useVault();
  const { isVaultDisconnected = false } = activeVault ?? {};

  if (isLoading || !activeVault || !isVaultDisconnected) {
    return null;
  }

  return (
    <BannerWithoutTitle
      leftDecorator={<WarningRing />}
      padding="16px"
      dataTestId="warning-banner"
    >
      <Text size="xxs">
        Carefully review the transaction displayed in your wallet before
        signing. Verify that it matches the intended ownership transfer. Once
        ownership is transferred, this action cannot be undone.
      </Text>
    </BannerWithoutTitle>
  );
};
