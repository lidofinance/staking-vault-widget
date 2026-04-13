import { Hex, Address, parseGwei } from 'viem';

import { getApiURL } from 'config';

import { validatorsApiRoutes } from '../consts';

export type FetchValidatorsParams = {
  page: number;
  limit: number;
  orderBy: 'index' | 'pubkey' | 'balance' | 'status';
  direction: 'ASC' | 'DESC';
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

export type ValidatorsOrderBy = `${ValidatorsOrderByEnum}`;

export type ValidatorsApiMeta = {
  totalBalance: string;
  blockNumber: number;
  timestamp: number;
  byStatus: Record<ValidatorStatus, number>;
};

export type ValidatorsApiPagination = {
  direction: 'ASC' | 'DESC';
  orderBy: ValidatorsOrderBy;
  page: number;
  total: number;
  offset: number;
  limit: number;
  remaining: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextOffset: number | null;
  previousOffset: number | null;
};

type ValidatorsApiResponse = {
  data: ValidatorsDTO[];
  pagination: ValidatorsApiPagination;
  meta: ValidatorsApiMeta;
};

export type FetchValidatorsMeta = Omit<ValidatorsApiMeta, 'totalBalance'> & {
  totalBalance: bigint;
};

export type FetchValidatorsResult = {
  meta: FetchValidatorsMeta;
  table: ValidatorsEntry[];
} & ValidatorsApiPagination;

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
  return date != null ? new Date(date) : undefined;
};

const optValue = <T>(value: T | null | undefined): T | undefined => {
  return value ?? undefined;
};

const normalizeResponse = (
  response: ValidatorsApiResponse,
): FetchValidatorsResult => {
  return {
    ...response.pagination,
    meta: {
      totalBalance: parseGwei(response.meta.totalBalance),
      blockNumber: response.meta.blockNumber,
      timestamp: response.meta.timestamp,
      byStatus: response.meta.byStatus,
    },
    table: response.data.map((validator) => ({
      pubkey: validator.pubkey,
      index: validator.index,
      balance: parseGwei(validator.balance),
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
