// `jest` from @jest/globals: the repo's @types/jest is v28 and has no types
// for the ESM module mocking used below.
import { jest, describe, test, expect, beforeEach } from '@jest/globals';
import type { NextApiRequest } from 'next';

const standardFetcher =
  jest.fn<(url: string, init: RequestInit) => Promise<unknown>>();

jest.unstable_mockModule('utils/standardFetcher', () => ({ standardFetcher }));
jest.unstable_mockModule('../fetch-api-wrapper', () => ({
  responseTimeExternalMetricWrapper: ({
    request,
  }: {
    request: () => unknown;
  }) => request(),
}));

const { createCachedProxy } = await import('../cached-proxy');
const { FetcherError } = await import('utils/fetcherError');

const makeRes = () => ({ status: jest.fn(), json: jest.fn(), end: jest.fn() });
const makeReq = (headers: Record<string, string> = {}) =>
  ({ query: {}, headers }) as unknown as NextApiRequest;

// Headers lowercases names
const sentHeaders = () =>
  Object.fromEntries(new Headers(standardFetcher.mock.calls[0][1].headers));

describe('createCachedProxy forwardHeaders', () => {
  beforeEach(() => {
    standardFetcher.mockReset();
    standardFetcher.mockResolvedValue({ isValid: true });
  });

  test('sends the headers built from the incoming request upstream', async () => {
    const proxy = createCachedProxy({
      proxyUrl: 'https://upstream/check',
      cacheTTL: 1,
      forwardHeaders: (req) => ({
        'X-Client-User-Agent': String(req.headers['user-agent']),
      }),
    });

    await proxy(makeReq({ 'user-agent': 'curl/8.5.0' }), makeRes() as any);

    expect(sentHeaders()).toMatchObject({
      'x-client-user-agent': 'curl/8.5.0',
      accept: 'application/json',
    });
  });

  test.each<Record<string, string>>([
    { Accept: 'text/html' },
    { accept: 'text/html', 'content-type': 'text/plain' },
  ])('cannot override the fixed upstream headers: %o', async (forwarded) => {
    const proxy = createCachedProxy({
      proxyUrl: 'https://upstream/check',
      cacheTTL: 1,
      forwardHeaders: () => forwarded,
    });

    await proxy(makeReq(), makeRes() as any);

    expect(sentHeaders()).toMatchObject({
      accept: 'application/json',
      'content-type': 'application/json',
    });
  });

  test('sends only the fixed headers without forwardHeaders', async () => {
    const proxy = createCachedProxy({
      proxyUrl: 'https://upstream/check',
      cacheTTL: 1,
    });

    await proxy(makeReq({ 'user-agent': 'curl/8.5.0' }), makeRes() as any);

    expect(sentHeaders()).toEqual({
      accept: 'application/json',
      'content-type': 'application/json',
    });
  });
});

describe('createCachedProxy errors', () => {
  const makeErrRes = () => ({
    status: jest.fn(),
    json: jest.fn(),
    end: jest.fn(),
    setHeader: jest.fn(),
  });

  beforeEach(() => {
    standardFetcher.mockReset();
  });

  test('forwards a 429 with no-store and does not cache it', async () => {
    standardFetcher.mockRejectedValueOnce(new FetcherError('slow down', 429));
    standardFetcher.mockResolvedValueOnce({ isValid: true });
    const proxy = createCachedProxy({
      proxyUrl: 'https://upstream/check',
      cacheTTL: 60000,
    });
    const res = makeErrRes();
    await proxy(makeReq(), res as any);

    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith({ error: 'slow down' });
    expect(res.setHeader).toHaveBeenCalledWith(
      'Cache-Control',
      expect.stringContaining('no-store'),
    );

    await proxy(makeReq(), makeErrRes() as any);
    expect(standardFetcher).toHaveBeenCalledTimes(2);
  });
});
