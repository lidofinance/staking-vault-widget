import { useVaultsConnected } from 'modules/web3/hooks/use-vaults-connected';
import { useVaultData } from 'shared/hooks/use-vault-data';
import { Address } from 'viem';

export const useVaultsDataAll = () => {
  const { data: connectedVaults, isLoading: isLoadingConnected } =
    useVaultsConnected();
  const {
    data: vaults,
    isLoading,
    ...rest
  } = useVaultData(connectedVaults as Address[] | undefined);

  return {
    vaults,
    isLoading: isLoadingConnected || isLoading,
    ...rest,
  };
};
