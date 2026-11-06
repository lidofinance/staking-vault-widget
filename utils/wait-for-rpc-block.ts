import type { PublicClient } from 'viem';

import { BLOCK_POLLING_INTERVAL } from 'config/groups/web3';

type BlockNumberClient = Pick<PublicClient, 'getBlockNumber'>;

// RPC normally reaches a just mined block within seconds
export const RPC_BLOCK_WAIT_TIMEOUT_MS = 30_000;

const throwIfAborted = (signal?: AbortSignal) => {
  if (signal?.aborted) throw signal.reason;
};

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const onAbort = () => {
      clearTimeout(timer);
      reject(signal?.reason);
    };
    const timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });

// A transient failure (e.g. a 429 from a load balancer) is retried, a persistent one is not:
// a dead RPC fails the wait in seconds instead of holding every query until the timeout.
// Expected behaviour: a burst of this many failures in a row (about 6 s with the backoff)
// also ends the wait, and getBlockToReadAt then reads at the RPC's latest block, which may
// still be before the tx. That is accepted: the freshness checks (isBehindTxBlock) keep
// such data from restoring edits or building txs, and useRefetchOnTxBlock reads it again.
export const MAX_CONSECUTIVE_POLL_FAILURES = 3;

// Waits until RPC reaches target block and returns its latest block.
// Polls until then. A failed poll is retried after a growing pause (so parallel waits don't
// keep a rate-limited RPC busy), and rejects after MAX_CONSECUTIVE_POLL_FAILURES in a row.
// An aborted signal stops the polling and rejects with its reason. A poll in flight when
// it fires still finishes (viem's getBlockNumber takes no signal), and if it reached the
// target its block is returned: the caller decides whether that still counts.
// Use waitForRpcBlockWithin or getBlockToReadAt, they bound it with a timeout.
export const waitForRpcBlock = async (
  publicClient: BlockNumberClient,
  targetBlock: bigint,
  signal?: AbortSignal,
): Promise<bigint> => {
  let failures = 0;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    throwIfAborted(signal);
    let latestRpcBlock: bigint | undefined;
    try {
      latestRpcBlock = await publicClient.getBlockNumber({ cacheTime: 0 });
      failures = 0;
    } catch (error) {
      failures += 1;
      if (failures >= MAX_CONSECUTIVE_POLL_FAILURES) throw error;
    }
    if (latestRpcBlock !== undefined && latestRpcBlock >= targetBlock) {
      return latestRpcBlock;
    }
    throwIfAborted(signal);
    // 1x while polling normally, 2x / 4x after consecutive failures
    await sleep(BLOCK_POLLING_INTERVAL * 2 ** failures, signal);
  }
};

class RpcBlockWaitTimeoutError extends Error {
  constructor() {
    super('RPC did not reach the block in time');
    this.name = 'RpcBlockWaitTimeoutError';
  }
}

// Waits for the target block at most `timeoutMs`, then stops polling.
// Resolves with the reached RPC block, or undefined if it was not reached: the timeout,
// or the RPC kept failing (transient failures are retried); rejects only when the
// caller's signal is aborted (e.g. the query is cancelled).
export const waitForRpcBlockWithin = async (
  publicClient: BlockNumberClient,
  targetBlock: bigint,
  {
    signal,
    timeoutMs = RPC_BLOCK_WAIT_TIMEOUT_MS,
  }: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<bigint | undefined> => {
  throwIfAborted(signal);
  // one signal for both: the caller's abort and the timeout end the polling loop
  const controller = new AbortController();
  const onAbort = () => controller.abort(signal?.reason);
  signal?.addEventListener('abort', onAbort, { once: true });
  const timer = setTimeout(
    () => controller.abort(new RpcBlockWaitTimeoutError()),
    timeoutMs,
  );
  try {
    const reached = await waitForRpcBlock(
      publicClient,
      targetBlock,
      controller.signal,
    );
    // a poll that outlived the caller's abort is not used (e.g. the query was cancelled);
    // one that outlived the timeout is: the target is reached, re-reading could go lower
    throwIfAborted(signal);
    return reached;
  } catch {
    if (signal?.aborted) throw signal.reason;
    // the timeout or a persistently failing RPC: the block is not reached
    return undefined;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', onAbort);
  }
};

// The block to read data at: the target once the RPC reaches it, otherwise, after the
// timeout, the RPC's latest block. Data read then is behind the target, and the freshness
// checks (isBehindTxBlock) treat it so: no restore of pending edits, outdated-data guard.
// A stuck node thus can't hold a query, and a submit awaiting it, for long or fail it.
// The signal (react-query's queryFn signal) stops waiting when the query is cancelled.
export const getBlockToReadAt = async (
  publicClient: BlockNumberClient,
  targetBlock: bigint,
  options: { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<bigint> =>
  (await waitForRpcBlockWithin(publicClient, targetBlock, options)) ??
  publicClient.getBlockNumber({ cacheTime: 0 });
