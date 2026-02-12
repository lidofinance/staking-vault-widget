import { useCallback } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { trackEvent } from '@lidofinance/analytics-matomo';

import { useLidoSDK } from 'modules/web3';
import {
  MATOMO_CLICK_EVENTS_TYPES,
  MATOMO_CLICK_EVENTS,
} from 'consts/matomo-click-events';

import { vaultListQueryKeys, fetchVaults } from 'modules/vaults';

import { useVaultListParams } from '../use-vault-list-params';

export const useConnectedVaultsList = () => {
  const { params, isReady, setPage, setSort } = useVaultListParams();
  const { publicClient, vaultModule } = useLidoSDK();
  const setPageWithEvent = useCallback(
    (newPage: number) => {
      trackEvent(
        ...MATOMO_CLICK_EVENTS[
          MATOMO_CLICK_EVENTS_TYPES.clickPaginationButtonAllVaults
        ],
      );
      setPage(newPage);
    },
    [setPage],
  );

  const query = useQuery({
    queryKey: [
      ...vaultListQueryKeys(publicClient.chain.id).AllVaults,
      { ...params },
    ] as const,
    placeholderData: keepPreviousData,
    enabled: isReady,
    queryFn: async ({ queryKey }) =>
      fetchVaults({ publicClient, vaultModule }, queryKey[3]),
  });

  const isAPI = !!query.data?.isAPI;

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    page: params.page,
    setPage: setPageWithEvent,
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
