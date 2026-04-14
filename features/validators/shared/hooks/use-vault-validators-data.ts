import { keepPreviousData, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import {
  fetchValidators,
  useVault,
  type FetchValidatorsResult,
} from 'modules/vaults';

import { useValidatorListParams } from './use-validator-list-params';

export const useVaultValidatorsData = () => {
  const { activeVault, queryKeys } = useVault();
  const {
    params,
    isReady,
    setPage,
    setSort,
    setFilterByStatus,
    setFilterByPubKey,
  } = useValidatorListParams();

  const query = useQuery<FetchValidatorsResult | undefined>({
    queryKey: [
      ...queryKeys.base,
      'vault-validators',
      activeVault?.address,
      params,
    ] as const,
    enabled: isReady,
    refetchOnMount: true,
    staleTime: 0,
    placeholderData: keepPreviousData,
    queryFn: async () => {
      invariant(
        activeVault,
        '[useVaultValidatorsData] activeVault is not defined',
      );

      return await fetchValidators(activeVault.address, { ...params });
    },
  });

  const data = query.data ?? ({} as FetchValidatorsResult);

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    // meta data
    meta: data.meta,

    // validators list
    validators: data.table,

    // pagination
    direction: data.direction,
    orderBy: data.orderBy,
    page: data.page,
    total: data.total,
    offset: data.offset,
    limit: data.limit,
    remaining: data.remaining,
    totalPages: data.totalPages,
    hasNextPage: data.hasNextPage,
    hasPreviousPage: data.hasPreviousPage,
    nextOffset: data.nextOffset,
    previousOffset: data.previousOffset,
    setSort,
    setPage,
    setFilterByStatus,
    setFilterByPubKey,
  };
};
