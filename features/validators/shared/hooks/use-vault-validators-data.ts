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
  const { params, isReady, setPage, setSort } = useValidatorListParams();

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

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    page: params.page,
    validators: query.data?.data,
    totalPages: query.data?.totalPages,
    orderBy: params.orderBy,
    direction: params.direction,
    hasNextPage: query.data?.hasNextPage,
    hasPreviousPage: query.data?.hasPreviousPage,
    nextOffset: query.data?.nextOffset,
    setSort,
    setPage,
  };
};
