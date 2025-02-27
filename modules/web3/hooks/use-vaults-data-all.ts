import { useState, useCallback } from 'react';

import { useVaultData } from 'shared/hooks/use-vault-data';
import { useVaultsConnectedBound } from 'modules/web3/hooks/use-vaults-connected-bound';

export const useVaultsDataAll = () => {
  const [{ from, to }, setPaginationData] = useState({
    from: 0,
    to: 3,
    page: 1,
  });

  const { data: addressesWithBound, isLoading: isLoadingConnected } =
    useVaultsConnectedBound(from, to);
  const [connectedVaults, pages] = addressesWithBound ?? [];
  const { data: vaults, isLoading, ...rest } = useVaultData(connectedVaults);

  const handlePagination = useCallback((page: number) => {
    // TODO: refactor. Waiting for Holesky
    setPaginationData({ from: 4, to: 7, page });
  }, []);

  return {
    vaults,
    pagesCount: Number(pages),
    isLoading: isLoadingConnected || isLoading,
    handlePagination,
    ...rest,
  };
};
