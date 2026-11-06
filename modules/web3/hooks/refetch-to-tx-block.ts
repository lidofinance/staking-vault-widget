import { isBehindTxBlock } from './is-behind-tx-block';

type BlockScopedResult = { data?: { blockNumber: bigint } };

export type BlockScopedRefetch = (options?: {
  cancelRefetch?: boolean;
}) => Promise<BlockScopedResult>;

// Joins an in-flight fetch instead of cancelling it (onSubmit awaits its own refetch).
// The joined fetch may have started before the latest tx and return the same old block:
// then nothing it is keyed on changes and no new fetch follows, so freshness is
// re-checked once it settles and one more fetch is made. Only one, so an RPC that is
// itself behind the tx block doesn't cause a refetch loop.
export const refetchToTxBlock = async (
  refetch: BlockScopedRefetch,
  getLatestTxBlock: () => bigint | undefined,
  isActive: () => boolean = () => true,
) => {
  const joined = await refetch({ cancelRefetch: false });
  if (!isActive()) return;
  if (isBehindTxBlock(joined.data?.blockNumber, getLatestTxBlock())) {
    await refetch({ cancelRefetch: false });
  }
};
