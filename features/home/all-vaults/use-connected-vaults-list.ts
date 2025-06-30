import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';
import {
  VAULTS_PER_PAGE,
  getVaultViewerContract,
  getVaultDataTable,
  vaultListQueryKeys,
} from 'modules/vaults';

export const useConnectedVaultsList = () => {
  const { shares, publicClient } = useLidoSDK();
  const [page, setPage] = useState(1);

  const query = useQuery({
    queryKey: [...vaultListQueryKeys(publicClient.chain.id).AllVaults, page],
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
          }).catch((e) => {
            console.warn(
              `[useMyVaultsList] Failed to fetch vault data for ${vaultAddress}:`,
              e,
            );
            return {
              address: vaultAddress,
            };
          }),
        ),
      );
      const totalVaultsCount =
        Number(fromCursor) + vaultAddress.length + Number(leftOver);
      const pagesCount = Math.ceil(totalVaultsCount / VAULTS_PER_PAGE);

      return { vaults, totalVaultsCount, pagesCount };
    },
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
