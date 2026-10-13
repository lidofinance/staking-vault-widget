import { Text, useBreakpoint } from '@lidofinance/lido-ui';

import { AddressBadge } from 'shared/components';
import { useVault, useVaultConfirmingRoles } from 'modules/vaults';
import { useDappStatus } from 'modules/web3';

import { Wrapper } from './styles';

export const TransferAddress = () => {
  const { address, isDappActive } = useDappStatus();
  const { activeVault } = useVault();
  const { hasAdmin } = useVaultConfirmingRoles();
  const isMobile = useBreakpoint('md');
  const symbols = isMobile ? 9 : 21;

  if (
    !isDappActive ||
    !hasAdmin ||
    !activeVault ||
    !activeVault.isVaultDisconnected
  ) {
    return null;
  }

  return (
    <Wrapper data-testid="transfer-address">
      <Text size="xs" strong>
        Transfer to the Vault Owner&apos;s address
      </Text>
      <AddressBadge
        address={address}
        symbols={symbols}
        dataTestId="transfer-address-value"
      />
    </Wrapper>
  );
};
