import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';
import {
  VAULTS_PER_PAGE,
  getVaultViewerContract,
  getVaultDataTable,
} from 'modules/vaults';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

export const useConnectedVaultsList = () => {
  const { shares, core } = useLidoSDK();
  const [page, setPage] = useState(1);
  const publicClient = core.rpcProvider;

  const query = useQuery({
    queryKey: ['vaults-connected', publicClient?.chain?.id, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const vaultViewer = getVaultViewerContract(publicClient);
      const fromCursor = BigInt(VAULTS_PER_PAGE * (page - 1));
      const toCursor = BigInt(page * VAULTS_PER_PAGE);
      const [vaultAddress, leftOver] =
        await vaultViewer.read.vaultsConnectedBound([fromCursor, toCursor]);
      const vaults = await Promise.all(
        vaultAddress.map((vaultAddress) =>
          getVaultDataTable({
            publicClient,
            vaultAddress,
            shares,
          }).catch(() => ({ address: vaultAddress, error: true })),
        ),
      );
      const totalVaultsCount =
        Number(fromCursor) + vaultAddress.length + Number(leftOver);
      const pagesCount = Math.ceil(totalVaultsCount / VAULTS_PER_PAGE);

      return { vaults, totalVaultsCount, pagesCount };
    },
    ...STRATEGY_LAZY,
  });

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    page,
    setPage,
    vaults: query.data?.vaults,
    pagesCount: query.data?.pagesCount,
    totalVaultsCount: query.data?.totalVaultsCount,
  };
};
