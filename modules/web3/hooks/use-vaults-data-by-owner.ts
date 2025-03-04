import { Address } from 'viem';

import { useVaultData } from 'shared/hooks/use-vault-data';
import { useVaultsByOwner } from 'modules/web3/hooks/use-vaults-by-owner';

export const useVaultsDataByOwner = (address: Address) => {
  const {
    data: ownerVaults,
    isLoading: isLoadingVaultsByOwner,
    isError: isErrorVaultsByOwner,
  } = useVaultsByOwner(address);

  const {
    data: vaults,
    isLoading,
    isError: isVaultsError,
    ...rest
  } = useVaultData(ownerVaults);

  return {
    vaults,
    isLoading: isLoadingVaultsByOwner || isLoading,
    isError: isErrorVaultsByOwner || isVaultsError,
    ...rest,
  };
};
