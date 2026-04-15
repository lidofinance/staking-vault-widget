import { keepPreviousData, useQuery } from '@tanstack/react-query';
import invariant from 'tiny-invariant';
import { type Address, type Hex, isAddress, isAddressEqual } from 'viem';

import {
  fetchValidators,
  useVault,
  useVaultConfirmingRoles,
  useVaultPermission,
  type FetchValidatorsResult,
} from 'modules/vaults';
import { useDappStatus } from 'modules/web3';
import { useDisableForm } from 'shared/hook-form';

import { useValidatorListParams } from './use-validator-list-params';
import { useCallback } from 'react';

export enum ValidatorPdgStage {
  NONE,
  PREDEPOSITED,
  PROVEN,
  ACTIVATED,
  COMPENSATED,
}

type ValidatorWithPdgStage = FetchValidatorsResult['table'][number] & {
  pdgStage: ValidatorPdgStage;
};

type selectValidatorDataArgs = {
  contract: {
    pdgPolicy: string;
    availableBalance: bigint;
    obligationsShortfallValue: bigint;
    beaconChainDepositsPauseIntent: boolean;
    beaconChainDepositsPaused: boolean;
    isVaultInJail: boolean;
    isReportFresh: boolean;
    depositor: Address;
  };
  meta?: FetchValidatorsResult['meta'];
  table?: ValidatorWithPdgStage[];
  pagination?: FetchValidatorsResult['pagination'];
};

export type ValidatorData = ReturnType<typeof selectValidatorData>;

const selectValidatorData = (data: selectValidatorDataArgs) => data;

const getValidatorByPubkey = (
  validators: ValidatorWithPdgStage[],
  pubkey: Hex,
): ValidatorWithPdgStage => {
  const validator = validators.find((item) => item.pubkey === pubkey);

  invariant(
    validator,
    `[useVaultValidatorsData] Validator with pubkey ${pubkey} not found`,
  );

  return validator;
};

export const useVaultValidatorsData = () => {
  const { activeVault, queryKeys } = useVault();
  const { address, isDappActive } = useDappStatus();
  const disabled = useDisableForm();
  const { hasAdmin } = useVaultConfirmingRoles();
  const { hasPermission } = useVaultPermission('validatorWithdrawalTrigger');
  const {
    params,
    isReady,
    setPage,
    setSort,
    setFilterByStatus,
    setFilterByPubKeyOrIndex,
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

      const [
        pdgPolicy,
        availableBalance,
        // By user
        { beaconChainDepositsPauseIntent },
        depositor,
        beaconChainDepositsPaused,
        isVaultInJail,
        obligationsShortfallValue,
      ] = await Promise.all([
        activeVault.dashboard.read.pdgPolicy(),
        activeVault.vault.read.availableBalance(),
        activeVault.hub.read.vaultConnection([activeVault.address]),
        activeVault.predepositGuarantee.read.nodeOperatorDepositor([
          activeVault.nodeOperator,
        ]),
        activeVault.vault.read.beaconChainDepositsPaused(),
        activeVault.operatorGrid.read.isVaultInJail([activeVault.address]),
        activeVault.hub.read.obligationsShortfallValue([activeVault.address]),
      ]);

      const response = await fetchValidators(activeVault.address, {
        ...params,
      });

      const tableWithPdgStage = response
        ? await Promise.all(
            response.table.map(async (validator) => {
              const { stage: pdgStage } =
                await activeVault.predepositGuarantee.read.validatorStatus([
                  validator.pubkey,
                ]);
              return {
                ...validator,
                pdgStage,
              };
            }),
          )
        : undefined;

      return {
        ...(response ?? {}),
        table: tableWithPdgStage,
        contract: {
          pdgPolicy: `${pdgPolicy}`,
          availableBalance,
          beaconChainDepositsPauseIntent,
          beaconChainDepositsPaused,
          depositor,
          isVaultInJail,
          obligationsShortfallValue,
          isReportFresh: activeVault.isReportFresh,
        },
      };
    },
    select: selectValidatorData,
  });

  const data = query.data ?? ({} as ValidatorData);
  const isDepositor =
    !!address &&
    isAddress(data.contract?.depositor) &&
    isAddressEqual(data.contract.depositor, address);
  const hideTableMenu =
    disabled || !isDappActive || !(hasAdmin || hasPermission || isDepositor);

  return {
    ...query,
    isLoading: query.isPending || query.isPlaceholderData,
    // meta data
    meta: data.meta,

    // validators list
    validators: data?.table,
    getValidatorByPubkey: useCallback(
      (pubkey: ValidatorWithPdgStage['pubkey']) => {
        invariant(
          data.table,
          '[getValidatorByPubkey] validators list is undefined',
        );
        return getValidatorByPubkey(data.table, pubkey);
      },
      [data?.table],
    ),

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
    pdgPolicy: data.contract?.pdgPolicy,
    availableBalance: data.contract?.availableBalance,
    beaconChainDepositsPauseIntent:
      data.contract?.beaconChainDepositsPauseIntent,
    beaconChainDepositsPaused: data.contract?.beaconChainDepositsPaused,
    isVaultInJail: data.contract?.isVaultInJail,
    isReportFresh: data.contract?.isReportFresh,
    obligationsShortfallValue: data.contract?.obligationsShortfallValue,
    depositor: data.contract?.depositor,
    isAdmin: !!hasAdmin,
    hasWithdrawalPermission: hasPermission,
    hasDepositorPermission: isDepositor,
    hideTableMenu,

    // query params
    params,

    // query functions
    setSort,
    setPage,
    setFilterByStatus,
    setFilterByPubKeyOrIndex,
  };
};
