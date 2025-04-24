import { useState, useCallback } from 'react';

import { useVaultData } from 'modules/vaults/hooks/use-vault-data';
import { useVaultsConnectedBound } from 'modules/vaults/hooks/use-vaults-connected-bound';

import { VAULTS_PER_PAGE } from 'modules/vaults/consts';

import type { Address } from 'viem';

export const useVaultsDataAll = () => {
  const [{ from, to }, setPaginationData] = useState({
    from: 0,
    to: 4,
    page: 1,
  });

  const {
    data: addressesWithBound,
    isLoading: isLoadingConnected,
    isError: isErrorConnected,
  } = useVaultsConnectedBound(from, to);

  const [connectedVaults, pages] = addressesWithBound ?? [];
  const {
    data: vaults,
    isLoading,
    isError: isVaultsDataError,
    ...rest
  } = useVaultData(connectedVaults as Address[] | undefined);

  const handlePagination = useCallback((page: number) => {
    const fromCursor = (page - 1) * VAULTS_PER_PAGE;
    const toCursor = page * VAULTS_PER_PAGE;
    setPaginationData({ from: fromCursor, to: toCursor, page });
  }, []);

  return {
    vaults,
    pagesCount: Number(pages),
    isLoading: isLoadingConnected || isLoading,
    handlePagination,
    isError: isErrorConnected || isVaultsDataError,
    ...rest,
  };
};
