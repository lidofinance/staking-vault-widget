import { Wrapper } from './styles';

import { AddressBadge } from 'shared/components/address-badge';
import { useVaults } from 'providers/vaults';

export const SelectedVault = () => {
  const { activeVault } = useVaults();

  if (!activeVault) return null;

  return (
    <Wrapper>
      <AddressBadge
        bgColor="transparent"
        address={activeVault.address}
        symbols={5}
      />
    </Wrapper>
  );
};
