import { useState } from 'react';
import { useReadContract } from 'wagmi';
import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';
import {
  VAULTS_PER_PAGE,
  getVaultViewerContract,
  getVaultDataTable,
} from 'modules/vaults';
import { getContractAddress } from 'config';
import { STRATEGY_LAZY } from 'consts/react-query-strategies';

import { VaultHubAbi } from 'abi/vault-hub';

const useVaultCount = () => {
  const { chainId } = useLidoSDK();
  const vaultHubAddress = getContractAddress(chainId, 'vaultHub');
  return useReadContract({
    address: vaultHubAddress,
    abi: VaultHubAbi,
    functionName: 'vaultsCount',
    query: {
      enabled: !!vaultHubAddress,
      select: Number,
    },
  });
};

export const useConnectedVaultsList = () => {
  const { shares, core } = useLidoSDK();
  const [page, setPage] = useState(1);
  const publicClient = core.rpcProvider;

  const { data: totalVaultsCount, ...vaultCountQuery } = useVaultCount();

  const pagesCount =
    typeof totalVaultsCount === 'number'
      ? Math.ceil(totalVaultsCount / VAULTS_PER_PAGE)
      : undefined;

  const query = useQuery({
    queryKey: ['vaults-connected', publicClient?.chain?.id, page],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const vaultViewer = getVaultViewerContract(publicClient);
      const fromCursor = BigInt(VAULTS_PER_PAGE * (page - 1));
      const toCursor = BigInt(page * VAULTS_PER_PAGE);
      const [vaultAddress] = await vaultViewer.read.vaultsConnectedBound([
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
      return vaults;
    },
    ...STRATEGY_LAZY,
  });

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    vaultCountQuery,
    page,
    setPage,
    pagesCount,
    totalVaultsCount,
  };
};
