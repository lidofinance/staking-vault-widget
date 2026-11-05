import { describe, test, expect, jest } from '@jest/globals';

import {
  refetchToTxBlock,
  type BlockScopedRefetch,
} from '../refetch-to-tx-block';

// each call resolves with the next block from the list
const refetchReturning = (...blocks: bigint[]) => {
  const refetch = jest.fn<BlockScopedRefetch>();
  blocks.forEach((blockNumber) =>
    refetch.mockResolvedValueOnce({ data: { blockNumber } }),
  );
  return refetch;
};

describe('refetchToTxBlock', () => {
  test('joins the in-flight fetch instead of cancelling it', async () => {
    const refetch = refetchReturning(10n);
    await refetchToTxBlock(refetch, () => 10n);
    expect(refetch).toHaveBeenCalledTimes(1);
    expect(refetch).toHaveBeenCalledWith({ cancelRefetch: false });
  });

  test('joined fetch returns the same old block → fetches once more', async () => {
    // cached and in-flight data are both at block 9, a tx then lands at block 10
    const refetch = refetchReturning(9n, 10n);
    await refetchToTxBlock(refetch, () => 10n);
    expect(refetch).toHaveBeenCalledTimes(2);
  });

  test('checks against the tx block at settle time, not at start', async () => {
    let latestTxBlock = 9n;
    const refetch = jest.fn<BlockScopedRefetch>().mockImplementationOnce(() => {
      // another sender's tx lands while the joined fetch is in flight
      latestTxBlock = 12n;
      return Promise.resolve({ data: { blockNumber: 9n } });
    });
    refetch.mockResolvedValueOnce({ data: { blockNumber: 12n } });

    await refetchToTxBlock(refetch, () => latestTxBlock);
    expect(refetch).toHaveBeenCalledTimes(2);
  });

  test('stops after one extra fetch if the RPC is still behind', async () => {
    const refetch = refetchReturning(9n, 9n, 9n);
    await refetchToTxBlock(refetch, () => 10n);
    expect(refetch).toHaveBeenCalledTimes(2);
  });

  test('no extra fetch once the effect is gone', async () => {
    const refetch = refetchReturning(9n, 10n);
    await refetchToTxBlock(
      refetch,
      () => 10n,
      () => false,
    );
    expect(refetch).toHaveBeenCalledTimes(1);
  });
});
