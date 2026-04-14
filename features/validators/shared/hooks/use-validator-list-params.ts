import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';
import type { Hex } from 'viem';

import { appPaths } from 'consts/routing';
import {
  type FetchValidatorsParams,
  useVault,
  VALIDATORS_PER_PAGE,
} from 'modules/vaults';
import invariant from 'tiny-invariant';

const DEFAULT_PARAMS: FetchValidatorsParams = {
  page: 1,
  orderBy: 'index',
  direction: 'ASC',
  limit: VALIDATORS_PER_PAGE,
  status: 'all',
  pubkey: undefined,
};

const queryToParams = (
  query: Record<string, string | string[] | undefined>,
): FetchValidatorsParams => {
  return {
    page: Number(query.page) || DEFAULT_PARAMS.page,
    orderBy: query.orderBy as FetchValidatorsParams['orderBy'],
    direction: query.direction as FetchValidatorsParams['direction'],
    limit: DEFAULT_PARAMS.limit,
    pubkey: query.pubkey as FetchValidatorsParams['pubkey'],
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

  const setFilterByPubKey = useCallback(
    (pubkey: FetchValidatorsParams['pubkey']) => {
      void pushParams({ ...params, pubkey });
    },
    [params, pushParams],
  );

  return {
    isReady,
    params,
    setPage,
    setSort,
    setFilterByStatus,
    setFilterByPubKey,
  };
};
