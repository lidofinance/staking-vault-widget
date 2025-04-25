import { Address } from 'viem';

import { useVaultDataTable } from 'modules/vaults/hooks/use-vault-data-table';
import { useVaultsByOwner } from 'modules/vaults/hooks/use-vaults-by-owner';
import { useDappStatus } from '../../web3/hooks/use-dapp-status';

export const useVaultsDataByOwner = () => {
  const { address } = useDappStatus();
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
  } = useVaultDataTable(ownerVaults as Address[] | undefined);

  return {
    vaults,
    isLoading: isLoadingVaultsByOwner || isLoading,
    isError: isErrorVaultsByOwner || isVaultsError,
    ...rest,
  };
};
