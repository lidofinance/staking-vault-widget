import { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { trackEvent } from '@lidofinance/analytics-matomo';

import { vaultListQueryKeys, fetchVaults } from 'modules/vaults';
import { useDappStatus, useLidoSDK } from 'modules/web3';
import {
  MATOMO_CLICK_EVENTS,
  MATOMO_CLICK_EVENTS_TYPES,
} from 'consts/matomo-click-events';

import { useVaultListParams } from '../use-vault-list-params';

export const useMyVaultsList = () => {
  const { address } = useDappStatus();
  const { publicClient, vaultModule } = useLidoSDK();
  const { isReady, params, setPage, setSort } = useVaultListParams();

  const setPageWithEvent = useCallback(
    (newPage: number) => {
      trackEvent(
        ...MATOMO_CLICK_EVENTS[
          MATOMO_CLICK_EVENTS_TYPES.clickPaginationButtonMyVaults
        ],
      );
      setPage(newPage);
    },
    [setPage],
  );

  const query = useQuery({
    queryKey: [
      ...vaultListQueryKeys(publicClient.chain.id).myVaults,
      { ...params, address },
    ] as const,
    queryFn: async ({ queryKey }) =>
      fetchVaults({ publicClient, vaultModule }, queryKey[4]),
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
    setPage: setPageWithEvent,
    vaults: query.data?.data,
    pagesCount: query.data?.pagesCount,
    nextUpdateAt: query.data?.nextUpdateAt,
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
