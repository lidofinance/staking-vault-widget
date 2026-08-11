// `jest` from @jest/globals: the repo's @types/jest is v28 and has no types
// for the ESM module mocking used below.
import {
  jest,
  describe,
  test,
  expect,
  beforeEach,
  afterEach,
} from '@jest/globals';

import { CHAINS } from '@lidofinance/lido-ethereum-sdk/common';

// Empty map → tests cover the unknown-contract path. Mock also avoids pulling
// in `config/`, which transitively imports `env-dynamics.mjs`.
jest.unstable_mockModule('../contract-addresses-metrics', () => ({
  METRIC_CONTRACT_ADDRESSES: {},
  getMetricContractAbi: () => null,
}));

const { collectRequestAddressMetric } = await import(
  '../collect-request-address-metric'
);

const VALID_UNKNOWN_TO = '0x0000000000000000000000000000000000000001';
const ETH_CALL_SELECTOR = '0xaabbccdd';

const makeEthCall = (to: string, data: string = ETH_CALL_SELECTOR) => ({
  jsonrpc: '2.0',
  id: 1,
  method: 'eth_call',
  params: [{ to, data }, 'latest'],
});

const makeCounterMock = () => {
  const recorded: Record<string, string>[] = [];
  const counter: any = {
    labels(labels: Record<string, string>) {
      return {
        inc: (n: number) => {
          recorded.push({ ...labels, __inc: String(n) });
        },
      };
    },
  };
  return { counter, recorded };
};

describe('collectRequestAddressMetric', () => {
  let warnSpy: ReturnType<typeof jest.spyOn>;

  beforeEach(() => {
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });

  afterEach(() => {
    warnSpy.mockRestore();
  });

  test('records ONE labeled increment per valid eth_call entry', async () => {
    const { counter, recorded } = makeCounterMock();
    await collectRequestAddressMetric({
      calls: [makeEthCall(VALID_UNKNOWN_TO)],
      chainId: CHAINS.Mainnet,
      metrics: counter,
    });
    expect(recorded.length).toBe(1);
  });

  test('skips non-eth_call and malformed entries without dropping siblings', async () => {
    const { counter, recorded } = makeCounterMock();
    await collectRequestAddressMetric({
      calls: [
        null,
        'garbage',
        { method: 'eth_call', params: [{ data: '0x' }, 'latest'] },
        { method: 'eth_blockNumber', params: [] },
        makeEthCall(VALID_UNKNOWN_TO),
      ],
      chainId: CHAINS.Mainnet,
      metrics: counter,
    });
    expect(recorded.length).toBe(1);
  });

  // Log lines must stay bounded regardless of entry size: parser errors can
  // quote their whole input back.
  test('never logs an oversized `to` value, and keeps processing the batch', async () => {
    const { counter, recorded } = makeCounterMock();
    const oversizedTo = `0x${'a'.repeat(128 * 1024)}`;

    await collectRequestAddressMetric({
      calls: [makeEthCall(oversizedTo), makeEthCall(VALID_UNKNOWN_TO)],
      chainId: CHAINS.Mainnet,
      metrics: counter,
    });

    expect(recorded.length).toBe(1);
    for (const args of warnSpy.mock.calls) {
      const line = args.map(String).join(' ');
      expect(line.length).toBeLessThan(1024);
      expect(line).not.toContain('aaaaaaaaaa');
    }
  });

  test('bounds the logged text when a call throws', async () => {
    const { counter } = makeCounterMock();
    // 42-char `to` passes the length guard but fails checksum parsing, so this
    // exercises the catch branch.
    await collectRequestAddressMetric({
      calls: [makeEthCall(`0x${'z'.repeat(40)}`)],
      chainId: CHAINS.Mainnet,
      metrics: counter,
    });

    expect(warnSpy).toHaveBeenCalled();
    for (const args of warnSpy.mock.calls) {
      expect(args.map(String).join(' ').length).toBeLessThan(512);
    }
  });
});
