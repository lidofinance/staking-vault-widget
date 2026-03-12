import { AddressBadge } from 'shared/components/address-badge';
import { useVault } from 'modules/vaults';

import { CurrentVaultWrapper } from './styles';

export const CurrentVault = () => {
  const { vaultAddress } = useVault();

  return (
    <CurrentVaultWrapper>
      <AddressBadge bgColor="transparent" address={vaultAddress} symbols={5} />
    </CurrentVaultWrapper>
  );
};
