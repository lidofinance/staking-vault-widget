import { useQuery } from '@tanstack/react-query';
import { vaultListQueryKeys, fetchVaults } from 'modules/vaults';
import { useDappStatus, useLidoSDK } from 'modules/web3';

import { useVaultListParams } from '../use-vault-list-params';

export const useMyVaultsList = () => {
  const { address } = useDappStatus();
  const { publicClient } = useLidoSDK();
  const { isReady, params, setPage, setSort } = useVaultListParams();

  const query = useQuery({
    queryKey: [
      ...vaultListQueryKeys(publicClient.chain.id).myVaults,
      { ...params, address },
    ] as const,
    queryFn: async ({ queryKey }) => fetchVaults({ publicClient }, queryKey[4]),
    enabled: !!address && isReady,
    placeholderData: (prevData) => {
      if (!address) return undefined;
      return prevData;
    },
  });

  const isAPI = !!query.data?.isAPI;

  return {
    ...query,
    isLoading: query.isLoading || query.isPlaceholderData,
    page: params.page,
    setPage,
    vaults: query.data?.data,
    pagesCount: query.data?.pagesCount,
    totalVaultsCount: query.data?.total,
    ...(isAPI
      ? {
          sortBy: params.sortBy,
          sortDir: params.sortDir,
          setSort,
        }
      : {}),
  };
};
