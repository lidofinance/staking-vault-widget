import { useState, useCallback, useMemo } from 'react';

import { useVaultDataTable } from 'modules/vaults/hooks';
import { useVaultsConnectedBound } from 'modules/vaults/hooks/use-vaults-connected-bound';

import { VAULTS_PER_PAGE } from 'modules/vaults/consts';

import type { Address } from 'viem';

export const useVaultsDataAll = () => {
  const [{ from, to, page }, setPaginationData] = useState({
    from: 0,
    to: VAULTS_PER_PAGE,
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
  } = useVaultDataTable(connectedVaults as Address[] | undefined);

  const handlePagination = useCallback((page: number) => {
    const fromCursor = VAULTS_PER_PAGE * (page - 1);
    const toCursor = page * VAULTS_PER_PAGE;
    setPaginationData({ from: fromCursor, to: toCursor, page });
  }, []);
  const pages = useMemo(
    () => Math.ceil((to + Number(leftOver)) / VAULTS_PER_PAGE),
    [to, leftOver],
  );
  const vaultsCount = useMemo(
    () => from + (vaults?.length ?? 0) + (Number(leftOver) ?? 0) || 0,
    [from, vaults, leftOver],
  );

  return {
    vaults,
    pagesCount: Number(pages),
    isLoading: isLoadingConnected || isLoading,
    handlePagination,
    isError: isErrorConnected || isVaultsDataError,
    page,
    vaultsCount,
    ...rest,
  };
};
