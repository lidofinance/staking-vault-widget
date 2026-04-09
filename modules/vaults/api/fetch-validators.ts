import type { Hex, Address } from 'viem';

import { getApiURL } from 'config';
import { optBigint } from 'utils/opt-bigint';

import { validatorsApiRoutes } from '../consts';

export type FetchValidatorsParams = {
  page: number;
  limit: number;
  orderBy: 'index' | 'pubkey' | 'balance' | 'status';
  direction: 'asc' | 'desc';
};

type ValidatorsDTO = {
  pubkey: Hex;
  index: number;
  balance: string;
  status: ValidatorStatus | null;
  activatedAt: string | null;
  exitedAt: string | null;
};

export type ValidatorsEntry = {
  pubkey: Hex;
  index: number;
  balance: bigint;
  status: ValidatorStatus | undefined;
  activatedAt: Date | undefined;
  exitedAt: Date | undefined;
};

export enum VALIDATOR_STATUSES {
  active_ongoing = 'active_ongoing',
  active_exiting = 'active_exiting',
  active_slashed = 'active_slashed',
  exited_slashed = 'exited_slashed',
  withdrawal_possible = 'withdrawal_possible',
  withdrawal_done = 'withdrawal_done',
  pending_initialised = 'pending_initialised',
  pending_queued = 'pending_queued',
  exited_unslashed = 'exited_unslashed',
}

export type ValidatorStatus = keyof typeof VALIDATOR_STATUSES;

export enum ValidatorsOrderByEnum {
  INDEX = 'index',
  PUBKEY = 'pubkey',
  BALANCE = 'balance',
  STATUS = 'status',
}

export type ValidatorsOrderBy = keyof typeof ValidatorsOrderByEnum;

type ValidatorsApiResponse = {
  orderBy: ValidatorsOrderBy;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextOffset: number | null;
  data: ValidatorsDTO[];
};

export type FetchValidatorsResult = {
  orderBy: ValidatorsOrderBy;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextOffset: number | null;
  data: ValidatorsEntry[];
};

const fetchValidatorsApi = async (
  vaultAddress: Address,
  params: FetchValidatorsParams,
) => {
  const apiUrl = getApiURL('validatorsApiBasePath');

  if (!apiUrl) {
    throw new Error(`[fetchValidatorsApi] Validators API URL is not defined`);
  }

  const response = await fetch(
    validatorsApiRoutes.validators(apiUrl, vaultAddress, {
      offset: (params.page - 1) * params.limit,
      limit: params.limit,
      orderBy: params.orderBy,
      direction: params.direction,
    }),
  );

  if (!response.ok) {
    throw new Error(
      `[fetchValidatorsApi] Failed to fetch vaults from API: ${response.status} ${response.statusText}`,
    );
  }
  const result = await response.json();

  return { ...result };
};

const optDate = (
  date: string | number | null | undefined,
): Date | undefined => {
  return date != null ? new Date(Number(date)) : undefined;
};

const optValue = <T>(value: T | null | undefined): T | undefined => {
  return value ?? undefined;
};

const normalizeResponse = (
  response: ValidatorsApiResponse,
): FetchValidatorsResult => {
  return {
    orderBy: response.orderBy,
    page: response.page,
    totalPages: response.totalPages,
    hasNextPage: response.hasNextPage,
    hasPreviousPage: response.hasPreviousPage,
    nextOffset: response.nextOffset,
    data: response.data.map((validator) => ({
      pubkey: validator.pubkey,
      index: validator.index,
      balance: optBigint(validator.balance),
      status: optValue(validator.status),
      activatedAt: optDate(validator.activatedAt),
      exitedAt: optDate(validator.exitedAt),
    })),
  };
};

export const fetchValidators = async (
  vaultAddress: Address,
  params: FetchValidatorsParams,
): Promise<FetchValidatorsResult | undefined> => {
  try {
    const result = await fetchValidatorsApi(vaultAddress, params);
    return normalizeResponse(result);
  } catch (error) {
    console.warn(
      '[fetchValidators] Error fetching connected vaults from api:',
      error,
    );
  }
};
