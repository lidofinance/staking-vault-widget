import { useState, useCallback } from 'react';

import { useVaultData } from 'shared/hooks/use-vault-data';
import { useVaultsConnectedBound } from 'modules/web3/hooks/use-vaults-connected-bound';
import { VAULTS_PER_PAGE } from 'consts/vault-hub-viewer';

export const useVaultsDataAll = () => {
  const [{ from, to }, setPaginationData] = useState({
    from: 0,
    to: 4,
    page: 1,
  });

  const { data: addressesWithBound, isLoading: isLoadingConnected } =
    useVaultsConnectedBound(from, to);
  const [connectedVaults, pages] = addressesWithBound ?? [];
  const { data: vaults, isLoading, ...rest } = useVaultData(connectedVaults);

  const handlePagination = useCallback((page: number) => {
    const toCursor = page * VAULTS_PER_PAGE - 1;
    const fromCursor = toCursor - VAULTS_PER_PAGE;
    // TODO: refactor. Waiting for Holesky
    setPaginationData({ from: toCursor, to: fromCursor, page });
  }, []);

  return {
    vaults,
    pagesCount: Number(pages),
    isLoading: isLoadingConnected || isLoading,
    handlePagination,
    ...rest,
  };
};
