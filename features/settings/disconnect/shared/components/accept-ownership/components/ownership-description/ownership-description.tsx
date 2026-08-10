import { Text, useBreakpoint } from '@lidofinance/lido-ui';

import { AddressBadge, InlineLoader } from 'shared/components';
import { useVault } from 'modules/vaults';

import { OwnershipAddressContainer } from './styles';

export const OwnershipDescription = () => {
  const { isLoading, isPending, activeVault } = useVault();
  const isMobile = useBreakpoint('md');
  const { pendingOwner, hasPendingOwner } = activeVault ?? {};
  const symbols = isMobile ? 5 : 21;

  if (!hasPendingOwner) {
    return null;
  }

  return (
    <OwnershipAddressContainer>
      <Text size="xs">Please accept ownership by the address</Text>
      <InlineLoader isLoading={isLoading || isPending} height={36}>
        <AddressBadge address={pendingOwner} symbols={symbols} />
      </InlineLoader>
    </OwnershipAddressContainer>
  );
};
