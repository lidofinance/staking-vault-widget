import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import {
  type FetchValidatorsParams,
  VALIDATORS_PER_PAGE,
} from 'modules/vaults';

const DEFAULT_PARAMS: FetchValidatorsParams = {
  page: 1,
  orderBy: 'index',
  direction: 'DESC',
  limit: VALIDATORS_PER_PAGE,
};

const queryToParams = (
  query: Record<string, string | string[] | undefined>,
): FetchValidatorsParams => {
  return {
    page: Number(query.page) || DEFAULT_PARAMS.page,
    orderBy: query.orderBy as FetchValidatorsParams['orderBy'],
    direction: query.direction as FetchValidatorsParams['direction'],
    limit: DEFAULT_PARAMS.limit,
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
  return query;
};

export const useValidatorListParams = () => {
  const { query, isReady, push, pathname } = useRouter();

  const params = useMemo(() => queryToParams(query), [query]);

  const pushParams = useCallback(
    (params: FetchValidatorsParams) => {
      const queryParams = paramsToQuery(params);
      return push(
        {
          pathname,
          query: queryParams,
        },
        undefined,
        { shallow: true },
      );
    },
    [pathname, push],
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

  return { isReady, params, setPage, setSort };
};
