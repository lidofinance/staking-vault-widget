import type { PublicClient } from 'viem';

import { BLOCK_POLLING_INTERVAL } from 'config/groups/web3';
import { awaitWithTimeout } from 'utils/await-with-timeout';

// Waits until RPC reaches target block and returns its latest block
export const waitForRpcBlock = async (
  publicClient: Pick<PublicClient, 'getBlockNumber'>,
  targetBlock: bigint,
): Promise<bigint> => {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const latestRpcBlock = await publicClient.getBlockNumber({
      cacheTime: 0,
    });

    if (latestRpcBlock >= targetBlock) {
      return latestRpcBlock;
    }
    await new Promise((resolve) => setTimeout(resolve, BLOCK_POLLING_INTERVAL));
  }
};

// RPC normally reaches a just mined block within seconds
export const RPC_BLOCK_WAIT_TIMEOUT_MS = 30_000;

// The block to read data at: the target once the RPC reaches it, otherwise, after the
// timeout, the RPC's latest block. Data read then is behind the target, and the freshness
// checks (isBehindTxBlock) treat it so: no restore of pending edits, outdated-data guard.
// A stuck node thus can't hold a query, and a submit awaiting it, for long or fail it.
export const getBlockToReadAt = async (
  publicClient: Pick<PublicClient, 'getBlockNumber'>,
  targetBlock: bigint,
  timeoutMs = RPC_BLOCK_WAIT_TIMEOUT_MS,
): Promise<bigint> =>
  awaitWithTimeout(waitForRpcBlock(publicClient, targetBlock), timeoutMs).catch(
    () => publicClient.getBlockNumber({ cacheTime: 0 }),
  );
