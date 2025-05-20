import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';
import {
  VAULTS_PER_PAGE,
  getVaultViewerContract,
  getVaultDataTable,
} from 'modules/vaults';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import { useState } from 'react';
import invariant from 'tiny-invariant';

export const useMyVaultsList = () => {
  const { address } = useDappStatus();
  const { shares, core } = useLidoSDK();
  const [page, setPage] = useState(1);
  const publicClient = core.rpcProvider;

  const query = useQuery({
    queryKey: ['user-vaults-connected', publicClient?.chain?.id, address, page],
    placeholderData: keepPreviousData,
    enabled: !!address,
    queryFn: async () => {
      invariant(address, 'Address is required');
      const vaultViewer = getVaultViewerContract(publicClient);
      const fromCursor = BigInt(VAULTS_PER_PAGE * (page - 1));
      const toCursor = BigInt(page * VAULTS_PER_PAGE);
      const [vaultAddress, leftOver] =
        await vaultViewer.read.vaultsByOwnerBound([
          address,
          fromCursor,
          toCursor,
        ]);
      const vaults = await Promise.all(
        vaultAddress.map((vaultAddress) =>
          getVaultDataTable({
            publicClient,
            vaultAddress,
            shares,
          }),
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
    page,
    setPage,
    isLoading: query.isPending || query.isPlaceholderData,
    pagesCount: query.data?.pagesCount,
    totalVaultsCount: query.data?.totalVaultsCount,
    vaults: query.data?.vaults,
  };
};
