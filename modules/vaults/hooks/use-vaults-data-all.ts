import { useState, useCallback, useMemo } from 'react';

import { useVaultData } from 'modules/vaults/hooks/use-vault-data';
import { useVaultsConnectedBound } from 'modules/vaults/hooks/use-vaults-connected-bound';

import { VAULTS_PER_PAGE } from 'modules/vaults/consts';

import type { Address } from 'viem';

export const useVaultsDataAll = () => {
  const [{ from, to, page }, setPaginationData] = useState({
    from: 0,
    to: 4,
    page: 1,
  });

  const {
    data: addressesWithBound,
    isLoading: isLoadingConnected,
    isError: isErrorConnected,
  } = useVaultsConnectedBound(from, to);

  const [connectedVaults, leftOver] = addressesWithBound ?? [];
  const {
    data: vaults,
    isLoading,
    isError: isVaultsDataError,
    ...rest
  } = useVaultData(connectedVaults as Address[] | undefined);

  const handlePagination = useCallback((page: number) => {
    const toCursor = page * VAULTS_PER_PAGE - 1;
    const fromCursor = VAULTS_PER_PAGE * (page - 1);
    // TODO: refactor. Waiting for devnet
    setPaginationData({ from: fromCursor, to: toCursor, page });
  }, []);
  const pages = useMemo(
    () => Math.ceil((to + Number(leftOver)) / VAULTS_PER_PAGE),
    [to, leftOver],
  );

  return {
    vaults,
    pagesCount: Number(pages),
    isLoading: isLoadingConnected || isLoading,
    handlePagination,
    isError: isErrorConnected || isVaultsDataError,
    page,
    ...rest,
  };
};
