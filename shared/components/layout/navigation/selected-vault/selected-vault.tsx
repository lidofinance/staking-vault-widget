import { Wrapper } from './styles';

import { AddressBadge } from 'shared/components/address-badge';
import { useVaultInfo } from 'features/overview/contexts';

export const SelectedVault = () => {
  const { activeVault } = useVaultInfo();

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
