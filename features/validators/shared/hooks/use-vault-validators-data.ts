import { keepPreviousData, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';

import {
  fetchValidators,
  useVault,
  type FetchValidatorsResult,
} from 'modules/vaults';

import { useValidatorListParams } from './use-validator-list-params';
import type { Address } from 'viem';

type selectValidatorDataArgs = {
  contract: {
    feeRecipient: Address;
    pdgPolicy: string;
    beaconChainDepositsPauseIntent: boolean;
  };
  meta?: FetchValidatorsResult['meta'];
  table?: FetchValidatorsResult['table'];
  pagination?: FetchValidatorsResult['pagination'];
};

export type ValidatorData = ReturnType<typeof selectValidatorData>;

const selectValidatorData = (data: selectValidatorDataArgs) => data;

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

  const query = useQuery({
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

      const [feeRecipient, pdgPolicy, { beaconChainDepositsPauseIntent }] =
        await Promise.all([
          activeVault.dashboard.read.feeRecipient(),
          activeVault.dashboard.read.pdgPolicy(),
          activeVault.hub.read.vaultConnection([activeVault.address]),
        ]);

      const response = await fetchValidators(activeVault.address, {
        ...params,
      });

      return {
        ...(response ?? {}),
        contract: {
          pdgPolicy: `${pdgPolicy}`,
          feeRecipient,
          beaconChainDepositsPauseIntent,
        },
      };
    },
    select: selectValidatorData,
  });

  const data = query.data ?? ({} as ValidatorData);

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    // meta data
    meta: data.meta,

    // validators list
    validators: data.table,

    // pagination
    direction: data.pagination?.direction,
    orderBy: data.pagination?.orderBy,
    page: data.pagination?.page,
    total: data.pagination?.total,
    offset: data.pagination?.offset,
    limit: data.pagination?.limit,
    remaining: data.pagination?.remaining,
    totalPages: data.pagination?.totalPages,
    hasNextPage: data.pagination?.hasNextPage,
    hasPreviousPage: data.pagination?.hasPreviousPage,
    nextOffset: data.pagination?.nextOffset,
    previousOffset: data.pagination?.previousOffset,

    // contracts data
    feeRecipient: data.contract?.feeRecipient,
    pdgPolicy: data.contract?.pdgPolicy,
    beaconChainDepositsPauseIntent:
      data.contract?.beaconChainDepositsPauseIntent,

    // query functions
    setSort,
    setPage,
    setFilterByStatus,
    setFilterByPubKey,
  };
};
