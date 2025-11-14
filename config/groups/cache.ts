import ms from 'ms';

export const CACHE_EXTERNAL_CONFIG_KEY = 'cache-external-config';
export const CACHE_EXTERNAL_CONFIG_TTL = ms('10m');

export const CACHE_DEFAULT_HEADERS =
  'public, max-age=180, stale-if-error=1200, stale-while-revalidate=60';
export const CACHE_VALIDATION_HEADERS =
  'public, max-age=30, stale-if-error=1200, stale-while-revalidate=30';
export const CACHE_DEFAULT_ERROR_HEADERS = 'no-store, must-revalidate';
