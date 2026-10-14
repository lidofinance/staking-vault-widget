// direct group import, not the `config` barrel: the barrel reaches this module
// back through provider -> external-config
import { USER_AGENT } from 'config/groups/app';
import { extractErrorMessage } from 'utils';
import { FetcherError } from './fetcherError';

// Server-side only: in the browser a custom User-Agent is either ignored or
// (Firefox) turns the request into a CORS preflight.
const USER_AGENT_HEADER: Record<string, string> =
  typeof window === 'undefined' ? { 'User-Agent': USER_AGENT } : {};

const DEFAULT_HEADERS: Record<string, string> = {
  'Content-type': 'application/json',
  ...USER_AGENT_HEADER,
};

const DEFAULT_PARAMS = {
  method: 'GET',
};

// callers pass their own `headers`, which would otherwise drop the defaults.
// Content-Type only with a body: on a bodyless GET it forces a CORS preflight
const mergeHeaders = (
  extra: HeadersInit | undefined,
  hasBody: boolean,
): Headers => {
  const merged = new Headers(hasBody ? DEFAULT_HEADERS : USER_AGENT_HEADER);
  new Headers(extra).forEach((value, key) => merged.set(key, value));
  return merged;
};

const extractError = async (response: Response) => {
  try {
    const error = await response.json();
    return extractErrorMessage(error);
  } catch (error) {
    return 'An error occurred while fetching the data';
  }
};

type StandardFetcher = <T>(url: string, params?: RequestInit) => Promise<T>;

export const standardFetcher: StandardFetcher = async (url, params) => {
  const response = await fetch(url, {
    ...DEFAULT_PARAMS,
    ...params,
    headers: mergeHeaders(params?.headers, params?.body != null),
  });

  if (!response.ok) {
    throw new FetcherError(await extractError(response), response.status);
  }

  return await response.json();
};
