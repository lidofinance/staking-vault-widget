import { z } from 'zod';
import { type Hex, type Address, isHex, parseGwei } from 'viem';

import { getApiURL } from 'config';

import { numberRegex } from 'features/validators/const';

import { validatorsApiRoutes } from '../consts';

export type FetchValidatorsParams = {
  page: number;
  limit: number;
  orderBy: 'index' | 'pubkey' | 'balance' | 'status' | 'activatedAt';
  direction: 'ASC' | 'DESC';
  status?: ValidatorStatus;
  pubkey?: Hex;
  index?: number;
};

type ValidatorsDTO = {
  pubkey: Hex;
  // null for `in_queue` rows: the deposit is still in the beacon chain queue,
  // so the validator has no index on the consensus layer yet
  index: number | null;
  balance: string;
  balanceInQueue: string;
  status: ValidatorStatus;
  isPdg: boolean;
  activatedAt: string | null;
  exitedAt: string | null;
};

export type ValidatorsEntry = {
  pubkey: Hex;
  index: number | null;
  balance: bigint;
  balanceInQueue: bigint;
  status: ValidatorStatus;
  isPdg: boolean;
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
  pending_initialized = 'pending_initialized',
  pending_queued = 'pending_queued',
  exited_unslashed = 'exited_unslashed',
  in_queue = 'in_queue',
}

export type ValidatorStatus = keyof typeof VALIDATOR_STATUSES;

export enum ValidatorsOrderByEnum {
  INDEX = 'index',
  PUBKEY = 'pubkey',
  BALANCE = 'balance',
  STATUS = 'status',
  ACTIVATED_AT = 'activatedAt',
}

export type ValidatorsOrderBy = `${ValidatorsOrderByEnum}`;

export type ValidatorsApiMeta = {
  totalBalance: string;
  blockNumber: number;
  timestamp: number;
  byStatus: Partial<Record<ValidatorStatus, number>>;
  offBookBalance: string;
  offBookCount: number;
  pdgBalance: string;
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

const validatorStatusSchema = z.nativeEnum(VALIDATOR_STATUSES);
const digitsOnlyStringSchema = z
  .string()
  .regex(numberRegex, 'Expected digits-only string');
const apiDateTimeStringSchema = z.string().datetime({ offset: true });

const hexSchema = z.custom<Hex>(
  (value) => typeof value === 'string' && isHex(value),
  'Expected hex value',
);

const validatorsByStatusSchema: z.ZodType<ValidatorsApiMeta['byStatus']> =
  z.object({
    active_ongoing: z.number().optional(),
    active_exiting: z.number().optional(),
    active_slashed: z.number().optional(),
    exited_slashed: z.number().optional(),
    withdrawal_possible: z.number().optional(),
    withdrawal_done: z.number().optional(),
    pending_initialized: z.number().optional(),
    pending_queued: z.number().optional(),
    exited_unslashed: z.number().optional(),
    in_queue: z.number().optional(),
  });

const validatorsDTOSchema: z.ZodType<ValidatorsDTO> = z.object({
  pubkey: hexSchema,
  index: z.number().nullable(),
  balance: digitsOnlyStringSchema,
  balanceInQueue: digitsOnlyStringSchema,
  status: validatorStatusSchema,
  isPdg: z.boolean(),
  activatedAt: apiDateTimeStringSchema.nullable(),
  exitedAt: apiDateTimeStringSchema.nullable(),
});

const validatorsApiPaginationSchema: z.ZodType<ValidatorsApiPagination> =
  z.object({
    direction: z.enum(['ASC', 'DESC']),
    orderBy: z.nativeEnum(ValidatorsOrderByEnum),
    page: z.number(),
    total: z.number(),
    offset: z.number(),
    limit: z.number(),
    remaining: z.number(),
    totalPages: z.number(),
    hasNextPage: z.boolean(),
    hasPreviousPage: z.boolean(),
    nextOffset: z.number().nullable(),
    previousOffset: z.number().nullable(),
  });

const validatorsApiMetaSchema: z.ZodType<ValidatorsApiMeta> = z.object({
  totalBalance: digitsOnlyStringSchema,
  blockNumber: z.number(),
  timestamp: z.number(),
  byStatus: validatorsByStatusSchema,
  offBookBalance: digitsOnlyStringSchema,
  offBookCount: z.number(),
  pdgBalance: digitsOnlyStringSchema,
});

const validatorsApiResponseSchema: z.ZodType<ValidatorsApiResponse> = z.object({
  data: z.array(validatorsDTOSchema),
  pagination: validatorsApiPaginationSchema,
  meta: validatorsApiMetaSchema,
});

export type FetchValidatorsMeta = Omit<
  ValidatorsApiMeta,
  'totalBalance' | 'offBookBalance' | 'pdgBalance'
> & {
  totalBalance: bigint;
  offBookBalance: bigint;
  pdgBalance: bigint;
};

export type FetchValidatorsResult = {
  meta: FetchValidatorsMeta;
  table: ValidatorsEntry[];
  pagination: ValidatorsApiPagination;
};

const fetchValidatorsApi = async (
  vaultAddress: Address,
  params: FetchValidatorsParams,
): Promise<ValidatorsApiResponse> => {
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
      status: params.status,
      pubkey: params.pubkey,
      index: params.index,
    }),
  );

  if (!response.ok) {
    throw new Error(
      `[fetchValidatorsApi] Failed to fetch validators from API: ${response.status} ${response.statusText}`,
    );
  }

  return validatorsApiResponseSchema.parse(await response.json());
};

const optDate = (
  date: string | number | null | undefined,
): Date | undefined => {
  return date != null ? new Date(date) : undefined;
};

const normalizeResponse = (
  response: ValidatorsApiResponse,
): FetchValidatorsResult => {
  return {
    pagination: { ...response.pagination },
    meta: {
      totalBalance: parseGwei(response.meta.totalBalance),
      blockNumber: response.meta.blockNumber,
      timestamp: response.meta.timestamp,
      byStatus: response.meta.byStatus,
      offBookBalance: parseGwei(response.meta.offBookBalance),
      offBookCount: response.meta.offBookCount,
      pdgBalance: parseGwei(response.meta.pdgBalance),
    },
    table: response.data.map((validator) => ({
      pubkey: validator.pubkey,
      index: validator.index,
      balance: parseGwei(validator.balance),
      balanceInQueue: parseGwei(validator.balanceInQueue),
      status: validator.status,
      isPdg: validator.isPdg,
      activatedAt: optDate(validator.activatedAt),
      exitedAt: optDate(validator.exitedAt),
    })),
  };
};

export const fetchValidators = async (
  vaultAddress: Address,
  params: FetchValidatorsParams,
): Promise<FetchValidatorsResult> => {
  const result = await fetchValidatorsApi(vaultAddress, params);
  return normalizeResponse(result);
};
