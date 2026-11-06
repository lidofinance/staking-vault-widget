import { describe, test, expect, jest } from '@jest/globals';

const POLL_MS = 5;

jest.unstable_mockModule('config/groups/web3', () => ({
  BLOCK_POLLING_INTERVAL: POLL_MS,
}));

const {
  getBlockToReadAt,
  MAX_CONSECUTIVE_POLL_FAILURES,
  waitForRpcBlock,
  waitForRpcBlockWithin,
} = await import('../wait-for-rpc-block');

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// RPC whose latest block grows by one per call, starting from `from`
const growingRpc = (from: bigint) => {
  let block = from;
  return { getBlockNumber: jest.fn(() => Promise.resolve(block++)) };
};

// a node that never reaches the tx block
const stuckRpc = (block = 7n) => ({
  getBlockNumber: jest.fn(() => Promise.resolve(block)),
});

describe('waitForRpcBlock', () => {
  test('returns the RPC block once it reaches the target', async () => {
    await expect(waitForRpcBlock(growingRpc(8n), 10n)).resolves.toBe(10n);
  });

  test('an aborted signal stops the polling', async () => {
    const rpc = stuckRpc();
    const controller = new AbortController();
    const waiting = waitForRpcBlock(rpc, 10n, controller.signal);

    await delay(POLL_MS * 3);
    controller.abort(new Error('cancelled'));
    await expect(waiting).rejects.toThrow('cancelled');

    const polls = rpc.getBlockNumber.mock.calls.length;
    await delay(POLL_MS * 5);
    // no polling after the abort
    expect(rpc.getBlockNumber.mock.calls.length).toBe(polls);
  });

  test('an already aborted signal does not poll at all', async () => {
    const rpc = stuckRpc();
    const controller = new AbortController();
    controller.abort(new Error('cancelled'));

    await expect(waitForRpcBlock(rpc, 10n, controller.signal)).rejects.toThrow(
      'cancelled',
    );
    expect(rpc.getBlockNumber).not.toHaveBeenCalled();
  });
});

describe('waitForRpcBlockWithin', () => {
  test('the timeout stops the polling, not only the waiting', async () => {
    const rpc = stuckRpc();

    await expect(
      waitForRpcBlockWithin(rpc, 10n, { timeoutMs: POLL_MS * 3 }),
    ).resolves.toBeUndefined();

    const polls = rpc.getBlockNumber.mock.calls.length;
    await delay(POLL_MS * 5);
    expect(rpc.getBlockNumber.mock.calls.length).toBe(polls);
  });

  // an RPC whose single poll stays in flight until answered
  const slowRpc = () => {
    let answer: (block: bigint) => void = () => {};
    const rpc = {
      getBlockNumber: jest.fn(
        () =>
          new Promise<bigint>((resolve) => {
            answer = resolve;
          }),
      ),
    };
    return { rpc, answer: (block: bigint) => answer(block) };
  };

  test("a poll that outlives the caller's abort is not used", async () => {
    const { rpc, answer } = slowRpc();
    const controller = new AbortController();
    const waiting = waitForRpcBlockWithin(rpc, 10n, {
      signal: controller.signal,
      timeoutMs: 1_000,
    });
    await delay(0);

    controller.abort(new Error('query cancelled'));
    // the in-flight poll reaches the block after the abort
    answer(10n);

    await expect(waiting).rejects.toThrow('query cancelled');
  });

  test('a poll that outlives the timeout and reached the block is used', async () => {
    const { rpc, answer } = slowRpc();
    const waiting = waitForRpcBlockWithin(rpc, 10n, { timeoutMs: POLL_MS });

    await delay(POLL_MS * 3);
    // the timeout fired while the poll was in flight, then it reached the target
    answer(10n);

    await expect(waiting).resolves.toBe(10n);
    expect(rpc.getBlockNumber).toHaveBeenCalledTimes(1);
  });

  test("the caller's abort rejects instead of reporting a timeout", async () => {
    const controller = new AbortController();
    const waiting = waitForRpcBlockWithin(stuckRpc(), 10n, {
      signal: controller.signal,
      timeoutMs: 1_000,
    });
    controller.abort(new Error('query cancelled'));

    await expect(waiting).rejects.toThrow('query cancelled');
  });

  test('a failed poll is retried: a transient RPC error does not end the wait', async () => {
    // e.g. a 429 from a load balancer right after the tx
    let calls = 0;
    const rpc = {
      getBlockNumber: jest.fn(() =>
        calls++ === 0 ? Promise.reject(new Error('429')) : Promise.resolve(10n),
      ),
    };
    await expect(
      waitForRpcBlockWithin(rpc, 10n, { timeoutMs: 1_000 }),
    ).resolves.toBe(10n);
  });

  test('a dead RPC gives up after a few failures, long before the timeout', async () => {
    const rpc = {
      getBlockNumber: jest.fn(() => Promise.reject(new Error('rpc down'))),
    };
    const started = Date.now();

    await expect(
      waitForRpcBlockWithin(rpc, 10n, { timeoutMs: 10_000 }),
    ).resolves.toBeUndefined();

    expect(rpc.getBlockNumber).toHaveBeenCalledTimes(
      MAX_CONSECUTIVE_POLL_FAILURES,
    );
    expect(Date.now() - started).toBeLessThan(1_000);
  });

  test('failures back off: the pause grows after each failed poll', async () => {
    const times: number[] = [];
    const rpc = {
      getBlockNumber: jest.fn(() => {
        times.push(Date.now());
        return Promise.reject(new Error('429'));
      }),
    };

    await waitForRpcBlockWithin(rpc, 10n, { timeoutMs: 10_000 });

    // pauses of 2x and 4x the polling interval
    expect(times[1] - times[0]).toBeGreaterThanOrEqual(POLL_MS * 2 - 1);
    expect(times[2] - times[1]).toBeGreaterThanOrEqual(POLL_MS * 4 - 1);
  });
});

describe('getBlockToReadAt', () => {
  test('returns the RPC block once it reaches the tx block', async () => {
    await expect(
      getBlockToReadAt(growingRpc(8n), 10n, { timeoutMs: 1_000 }),
    ).resolves.toBe(10n);
  });

  test("a stuck node doesn't hold the read: after the timeout its latest block is used", async () => {
    // the data is then behind the tx block, and freshness checks treat it so
    await expect(
      getBlockToReadAt(stuckRpc(7n), 10n, { timeoutMs: POLL_MS * 3 }),
    ).resolves.toBe(7n);
  });

  test('a dead RPC fails the read in seconds, not after the timeout', async () => {
    const rpc = {
      getBlockNumber: jest.fn(() => Promise.reject(new Error('rpc down'))),
    };
    await expect(
      getBlockToReadAt(rpc, 10n, { timeoutMs: 10_000 }),
    ).rejects.toThrow('rpc down');
  });

  test('a cancelled query does not fall back to reading', async () => {
    const rpc = stuckRpc();
    const controller = new AbortController();
    const reading = getBlockToReadAt(rpc, 10n, {
      signal: controller.signal,
      timeoutMs: 1_000,
    });
    controller.abort(new Error('query cancelled'));

    await expect(reading).rejects.toThrow('query cancelled');
  });
});
