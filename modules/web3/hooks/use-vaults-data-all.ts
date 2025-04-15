import { useState, useCallback } from 'react';

import { useVaultData } from 'shared/hooks/use-vault-data';
import { useVaultsConnectedBound } from 'modules/web3/hooks/use-vaults-connected-bound';
import { VAULTS_PER_PAGE } from 'consts/vault-viewer';
import { Address } from 'viem';

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
    const toCursor = page * VAULTS_PER_PAGE - 1;
    const fromCursor = toCursor - VAULTS_PER_PAGE;
    // TODO: refactor. Waiting for devnet
    setPaginationData({ from: toCursor, to: fromCursor, page });
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
