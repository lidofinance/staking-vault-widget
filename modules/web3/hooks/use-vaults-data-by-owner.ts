import { Address } from 'viem';

import { useVaultData } from 'shared/hooks/use-vault-data';
import { useVaultsByOwner } from 'modules/web3/hooks/use-vaults-by-owner';

export const useVaultsDataByOwner = (address: Address) => {
  const { data: ownerVaults, isLoading: isLoadingVaultsByOwner } =
    useVaultsByOwner(address);
  const {
    data: vaults,
    isLoading,
    ...rest
  } = useVaultData(ownerVaults as Address[] | undefined);

  return {
    vaults,
    isLoading: isLoadingVaultsByOwner || isLoading,
    ...rest,
  };
};
