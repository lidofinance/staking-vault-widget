import { jest, describe, test, expect, beforeEach } from '@jest/globals';

const standardFetcher =
  jest.fn<(url: string, init?: any) => Promise<unknown>>();
const queryClient = {
  fetchQuery: ({ queryFn }: { queryFn: () => Promise<unknown> }) => queryFn(),
};

jest.unstable_mockModule('utils/standardFetcher', () => ({ standardFetcher }));
jest.unstable_mockModule('config', () => ({
  config: { addressApiValidationEnabled: true, ipfsMode: false },
}));
jest.unstable_mockModule('consts/api', () => ({
  API_ROUTES: { VALIDATION: 'api/validation' },
}));
jest.unstable_mockModule('react', () => ({
  useCallback: (fn: unknown) => fn,
}));
jest.unstable_mockModule('@tanstack/react-query', () => ({
  useQueryClient: () => queryClient,
}));

const { useApiAddressValidation } = await import(
  '../use-api-address-validation'
);
const { FetcherError } = await import('utils/fetcherError');

const ADDR = '0x0000000000000000000000000000000000000001' as const;

describe('useApiAddressValidation', () => {
  beforeEach(() => {
    standardFetcher.mockReset();
  });

  test('returns invalid on a 429', async () => {
    standardFetcher.mockRejectedValue(new FetcherError('x', 429));
    expect(await useApiAddressValidation()(ADDR)).toEqual({ isValid: false });
  });

  test.each([
    ['403', new FetcherError('x', 403)],
    ['500', new FetcherError('x', 500)],
    ['network', new TypeError('fetch failed')],
  ])('returns null (fallback) on %s', async (_n, err) => {
    standardFetcher.mockRejectedValue(err);
    expect(await useApiAddressValidation()(ADDR)).toBeNull();
  });

  test('returns API result on success', async () => {
    standardFetcher.mockResolvedValue({ isValid: true });
    expect(await useApiAddressValidation()(ADDR)).toEqual({ isValid: true });
  });
});
