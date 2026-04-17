import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { isHex, type Hex } from 'viem';
import invariant from 'tiny-invariant';

import { appPaths } from 'consts/routing';
import {
  type FetchValidatorsParams,
  type ValidatorStatus,
  VALIDATOR_STATUSES,
  ValidatorsOrderByEnum,
  useVault,
  VALIDATORS_PER_PAGE,
} from 'modules/vaults';
import { isNumber } from 'utils';

import {
  numberRegex,
  VALIDATOR_PUBKEY_LENGTH,
} from 'features/validators/const';

const DEFAULT_PARAMS: FetchValidatorsParams = {
  page: 1,
  orderBy: 'index',
  direction: 'ASC',
  limit: VALIDATORS_PER_PAGE,
  status: undefined,
  pubkey: undefined,
  index: undefined,
};

export type ValidatorStatusFilter = ValidatorStatus | 'all';

const VALID_DIRECTIONS: Set<FetchValidatorsParams['direction']> = new Set([
  'ASC',
  'DESC',
]);
const VALID_STATUSES = new Set(Object.values(VALIDATOR_STATUSES)) as Set<
  FetchValidatorsParams['status']
>;
const VALID_ORDER_BY = new Set(Object.values(ValidatorsOrderByEnum)) as Set<
  FetchValidatorsParams['orderBy']
>;

const getQueryParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const validatePage = (
  value: string | string[] | number | undefined,
): number | undefined => {
  const queryValue = isNumber(value) ? String(value) : getQueryParam(value);

  if (!queryValue || !numberRegex.test(queryValue)) {
    return;
  }

  const page = Number(queryValue);

  if (!Number.isSafeInteger(page) || page < 1) {
    return;
  }

  return page;
};

const validateOrderBy = (
  value: string | string[] | undefined,
): FetchValidatorsParams['orderBy'] | undefined => {
  const queryValue = getQueryParam(value);

  if (
    !queryValue ||
    !VALID_ORDER_BY.has(queryValue as FetchValidatorsParams['orderBy'])
  ) {
    return;
  }

  return queryValue as FetchValidatorsParams['orderBy'];
};

const validateDirection = (
  value: string | string[] | undefined,
): FetchValidatorsParams['direction'] | undefined => {
  const queryValue = getQueryParam(value);

  if (
    !queryValue ||
    !VALID_DIRECTIONS.has(queryValue as FetchValidatorsParams['direction'])
  ) {
    return;
  }

  return queryValue as FetchValidatorsParams['direction'];
};

const validateStatus = (
  value: string | string[] | undefined,
): FetchValidatorsParams['status'] | undefined => {
  const queryValue = getQueryParam(value);

  if (
    !queryValue ||
    !VALID_STATUSES.has(queryValue as FetchValidatorsParams['status'])
  ) {
    return;
  }

  return queryValue as FetchValidatorsParams['status'];
};

const validatePubkey = (
  value: string | string[] | undefined,
): Hex | undefined => {
  const queryValue = getQueryParam(value)?.trim().toLowerCase();

  if (
    !queryValue ||
    !isHex(queryValue) ||
    queryValue.length !== VALIDATOR_PUBKEY_LENGTH
  ) {
    return;
  }

  return queryValue;
};

const validateIndex = (
  value: string | string[] | number | undefined,
): number | undefined => {
  const queryValue = isNumber(value) ? String(value) : getQueryParam(value);

  if (!queryValue || !numberRegex.test(queryValue)) {
    return;
  }

  const index = Number(queryValue);

  if (!Number.isSafeInteger(index) || index < 0) {
    return;
  }

  return index;
};

const queryToParams = (
  query: Record<string, string | string[] | undefined>,
): FetchValidatorsParams => {
  return {
    page: validatePage(query.page) ?? DEFAULT_PARAMS.page,
    orderBy: validateOrderBy(query.orderBy) ?? DEFAULT_PARAMS.orderBy,
    direction: validateDirection(query.direction) ?? DEFAULT_PARAMS.direction,
    limit: DEFAULT_PARAMS.limit,
    pubkey: validatePubkey(query.pubkey),
    index: validateIndex(query.index),
    status: validateStatus(query.status) ?? DEFAULT_PARAMS.status,
  };
};

const paramsToQuery = (
  params: FetchValidatorsParams,
): Record<string, string | undefined> => {
  const query: Record<string, string> = {};
  const page = validatePage(params.page);
  const orderBy = validateOrderBy(params.orderBy);
  const direction = validateDirection(params.direction);
  const status = validateStatus(params.status);
  const pubkey = validatePubkey(params.pubkey);
  const index = validateIndex(params.index);

  if (page != null && page !== DEFAULT_PARAMS.page) {
    query.page = String(page);
  }
  if (orderBy && orderBy !== DEFAULT_PARAMS.orderBy) {
    query.orderBy = orderBy;
  }
  if (direction && direction !== DEFAULT_PARAMS.direction) {
    query.direction = direction;
  }
  if (status && status !== DEFAULT_PARAMS.status) {
    query.status = status;
  }
  if (pubkey && pubkey !== DEFAULT_PARAMS.pubkey) {
    query.pubkey = pubkey;
  }
  if (index != null && index !== DEFAULT_PARAMS.index) {
    query.index = String(index);
  }
  return query;
};

export const checkIsParamsDefault = (params: FetchValidatorsParams) => {
  return (
    params.page === DEFAULT_PARAMS.page &&
    params.limit === DEFAULT_PARAMS.limit &&
    params.status === DEFAULT_PARAMS.status &&
    params.pubkey === DEFAULT_PARAMS.pubkey &&
    params.index === DEFAULT_PARAMS.index
  );
};

export const useValidatorListParams = () => {
  const { query, isReady, push } = useRouter();
  const { vaultAddress } = useVault();
  const { params, isParamsDefault } = useMemo(() => {
    const params = queryToParams(query);
    const isParamsDefault = checkIsParamsDefault(params);

    return { params, isParamsDefault };
  }, [query]);

  const pushParams = useCallback(
    (params: FetchValidatorsParams) => {
      invariant(
        vaultAddress,
        '[useValidatorListParams] vault address is not defined',
      );

      const queryParams = paramsToQuery(params);
      const pathname = appPaths.vaults.vault(vaultAddress).validators;
      return push(
        {
          pathname,
          query: queryParams,
        },
        undefined,
        { shallow: true },
      );
    },
    [vaultAddress, push],
  );

  const setPage = useCallback(
    (newPage: number) => {
      void pushParams({ ...params, page: newPage });
    },
    [params, pushParams],
  );

  const setSort = useCallback(
    (
      orderBy: FetchValidatorsParams['orderBy'],
      direction: FetchValidatorsParams['direction'],
    ) => {
      void pushParams({ ...params, orderBy, direction, page: 1 });
    },
    [params, pushParams],
  );

  const setFilterByStatus = useCallback(
    (status: ValidatorStatusFilter | undefined) => {
      void pushParams({
        ...params,
        status: status === 'all' ? undefined : status,
        page: 1,
      });
    },
    [params, pushParams],
  );

  const setFilterByPubKeyOrIndex = useCallback(
    ({ pubkey, index }: Pick<FetchValidatorsParams, 'pubkey' | 'index'>) => {
      void pushParams({ ...params, pubkey, index, page: 1 });
    },
    [params, pushParams],
  );

  return {
    isReady,
    params,
    isParamsDefault,
    setPage,
    setSort,
    setFilterByStatus,
    setFilterByPubKeyOrIndex,
  };
};
