import { describe, test, expect, jest } from '@jest/globals';

jest.unstable_mockModule('config/groups/web3', () => ({
  BLOCK_POLLING_INTERVAL: 5,
}));

const { getBlockToReadAt } = await import('../wait-for-rpc-block');

// RPC whose latest block grows by one per call, starting from `from`
const rpc = (from: bigint) => {
  let block = from;
  return {
    getBlockNumber: jest.fn(() => Promise.resolve(block++)),
  };
};

describe('getBlockToReadAt', () => {
  test('returns the RPC block once it reaches the tx block', async () => {
    const client = rpc(8n);
    await expect(getBlockToReadAt(client, 10n, 1_000)).resolves.toBe(10n);
  });

  test("a stuck node doesn't hold the read: after the timeout its latest block is used", async () => {
    const client = { getBlockNumber: jest.fn(() => Promise.resolve(7n)) };
    // the data is then behind the tx block, and freshness checks treat it so
    await expect(getBlockToReadAt(client, 10n, 30)).resolves.toBe(7n);
  });
});
