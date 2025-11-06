import { useQuery, keepPreviousData } from '@tanstack/react-query';

import { useLidoSDK } from 'modules/web3';

import { vaultListQueryKeys, fetchVaults } from 'modules/vaults';

import { useVaultListParams } from '../use-vault-list-params';

export const useConnectedVaultsList = () => {
  const { params, isReady, setPage, setSort } = useVaultListParams();
  const { shares, publicClient } = useLidoSDK();

  const query = useQuery({
    queryKey: [
      ...vaultListQueryKeys(publicClient.chain.id).AllVaults,
      { ...params },
    ] as const,
    placeholderData: keepPreviousData,
    enabled: isReady,
    queryFn: async ({ queryKey }) =>
      fetchVaults({ publicClient, shares }, queryKey[3]),
  });

  const isAPI = !!query.data?.isAPI;

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    page: params.page,
    setPage,
    vaults: query.data?.data,
    pagesCount: query.data?.pagesCount,
    totalVaultsCount: query.data?.total,
    nextUpdateAt: query.data?.nextUpdateAt,
    ...(isAPI
      ? {
          sortBy: params.sortBy,
          sortDir: params.sortDir,
          setSort,
        }
      : {}),
  };
};
