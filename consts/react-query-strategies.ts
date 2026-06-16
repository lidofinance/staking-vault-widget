import { DefaultOptions } from '@tanstack/react-query';

type QueryOptions = DefaultOptions['queries'];

const TWENTY_MINUTES = 20 * 60 * 1000;

const TEN_MINUTES = 10 * 60 * 1000;

const ONE_MINUTE = 60 * 1000;

export const STRATEGY_IMMUTABLE = {
  gcTime: TWENTY_MINUTES,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchInterval: false,
} satisfies QueryOptions;

export const STRATEGY_CONSTANT = {
  gcTime: TWENTY_MINUTES,
  staleTime: Infinity,
  refetchOnWindowFocus: false,
  refetchOnReconnect: false,
  refetchOnMount: false,
  refetchInterval: TWENTY_MINUTES,
} satisfies QueryOptions;

export const STRATEGY_LAZY = {
  gcTime: TWENTY_MINUTES,
  staleTime: ONE_MINUTE,
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  refetchOnMount: true,
  refetchInterval: TEN_MINUTES,
} satisfies QueryOptions;

export const STRATEGY_EAGER = {
  gcTime: TWENTY_MINUTES,
  staleTime: 0,
  refetchOnWindowFocus: true,
  refetchOnReconnect: true,
  refetchOnMount: true,
  refetchInterval: ONE_MINUTE, // 1 minute
} satisfies QueryOptions;
