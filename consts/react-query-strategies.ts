import { DefaultOptions } from '@tanstack/react-query';

type QueryOptions = DefaultOptions['queries'];

const TWENTY_MINUTES = 20 * 60 * 1000;

const TEN_MINUTES = 10 * 60 * 1000;

const ONE_MINUTE = 60 * 1000;

export const STRATEGY_IMMUTABLE: QueryOptions = {
  gcTime: TWENTY_MINUTES,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchInterval: false,
};

export const STRATEGY_CONSTANT: QueryOptions = {
  gcTime: TWENTY_MINUTES,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchInterval: TWENTY_MINUTES,
};

export const STRATEGY_LAZY: QueryOptions = {
  gcTime: TWENTY_MINUTES,
  staleTime: ONE_MINUTE,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: true,
  refetchInterval: TEN_MINUTES,
};

export const STRATEGY_EAGER: QueryOptions = {
  gcTime: TWENTY_MINUTES,
  staleTime: 0,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: true,
  refetchInterval: ONE_MINUTE, // 1 minute
};
