import type { PublicClient } from 'viem';

import { BLOCK_POLLING_INTERVAL } from 'config/groups/web3';

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
