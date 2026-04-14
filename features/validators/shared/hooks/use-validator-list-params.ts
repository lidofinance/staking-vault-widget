import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import { isHex, type Hex } from 'viem';
import invariant from 'tiny-invariant';

import { appPaths } from 'consts/routing';
import {
  type FetchValidatorsParams,
  useVault,
  VALIDATORS_PER_PAGE,
} from 'modules/vaults';

import {
  numberRegex,
  VALIDATOR_PUBKEY_LENGTH,
} from 'features/validators/const';

const DEFAULT_PARAMS: FetchValidatorsParams = {
  page: 1,
  orderBy: 'index',
  direction: 'ASC',
  limit: VALIDATORS_PER_PAGE,
  status: 'all',
  pubkey: undefined,
  index: undefined,
};

const getQueryParam = (value: string | string[] | undefined) => {
  return Array.isArray(value) ? value[0] : value;
};

const parseValidatorPubkey = (
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

const parseValidatorIndex = (value: string | string[] | undefined) => {
  const queryValue = getQueryParam(value);

  if (!queryValue || !numberRegex.test(queryValue)) {
    return;
  }

  const index = Number(queryValue);

  if (!Number.isSafeInteger(index)) {
    return;
  }

  return index;
};

const queryToParams = (
  query: Record<string, string | string[] | undefined>,
): FetchValidatorsParams => {
  return {
    page: Number(getQueryParam(query.page)) || DEFAULT_PARAMS.page,
    orderBy: query.orderBy as FetchValidatorsParams['orderBy'],
    direction: query.direction as FetchValidatorsParams['direction'],
    limit: DEFAULT_PARAMS.limit,
    pubkey: parseValidatorPubkey(query.pubkey),
    index: parseValidatorIndex(query.index),
    status: query.status as FetchValidatorsParams['status'],
  };
};

const paramsToQuery = (
  params: FetchValidatorsParams,
): Record<string, string | undefined> => {
  const query: Record<string, string> = {};
  if (params.page !== DEFAULT_PARAMS.page) {
    query.page = String(params.page);
  }
  if (params.orderBy !== DEFAULT_PARAMS.orderBy) {
    query.orderBy = params.orderBy;
  }
  if (params.direction !== DEFAULT_PARAMS.direction) {
    query.direction = params.direction;
  }
  if (params.status && params.status !== DEFAULT_PARAMS.status) {
    query.status = params.status;
  }
  if (params.pubkey !== DEFAULT_PARAMS.pubkey) {
    query.pubkey = params.pubkey as Hex;
  }
  if (params.index !== DEFAULT_PARAMS.index) {
    query.index = String(params.index);
  }
  return query;
};

export const useValidatorListParams = () => {
  const { query, isReady, push } = useRouter();
  const { vaultAddress } = useVault();
  const params = useMemo(() => queryToParams(query), [query]);

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
    (status: FetchValidatorsParams['status']) => {
      void pushParams({ ...params, status });
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
    setPage,
    setSort,
    setFilterByStatus,
    setFilterByPubKeyOrIndex,
  };
};
