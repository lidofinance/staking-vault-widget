import { useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

import { type FetchVaultsParams, VAULTS_PER_PAGE } from 'modules/vaults';

const DEFAULT_PARAMS: FetchVaultsParams = {
  page: 1,
  sortBy: 'totalValue',
  sortDir: 'desc',
  perPage: VAULTS_PER_PAGE,
};

const queryToParams = (
  query: Record<string, string | string[] | undefined>,
): FetchVaultsParams => {
  return {
    page: Number(query.page) || DEFAULT_PARAMS.page,
    sortBy:
      (query.sortBy as FetchVaultsParams['sortBy']) || DEFAULT_PARAMS.sortBy,
    sortDir:
      (query.sortDir as FetchVaultsParams['sortDir']) || DEFAULT_PARAMS.sortDir,
    perPage: DEFAULT_PARAMS.perPage,
  };
};

const paramsToQuery = (
  params: FetchVaultsParams,
): Record<string, string | undefined> => {
  const query: Record<string, string> = {};
  if (params.page !== DEFAULT_PARAMS.page) {
    query.page = String(params.page);
  }
  if (params.sortBy !== DEFAULT_PARAMS.sortBy) {
    query.sortBy = params.sortBy;
  }
  if (params.sortDir !== DEFAULT_PARAMS.sortDir) {
    query.sortDir = params.sortDir;
  }
  return query;
};

export const useVaultListParams = () => {
  const { query, isReady, push, pathname } = useRouter();

  const params = useMemo(() => queryToParams(query), [query]);

  const pushParams = useCallback(
    (params: FetchVaultsParams) => {
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
      sortBy: FetchVaultsParams['sortBy'],
      sortDir: FetchVaultsParams['sortDir'],
    ) => {
      void pushParams({ ...params, sortBy, sortDir, page: 1 });
    },
    [params, pushParams],
  );

  return { isReady, params, setPage, setSort };
};
