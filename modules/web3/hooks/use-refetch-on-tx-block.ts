import { useEffect } from 'react';

import { useLidoSDK } from 'modules/web3';

import { isBehindTxBlock } from './is-behind-tx-block';

type BlockScopedQuery = {
  data?: { blockNumber: bigint };
  refetch: (options?: { cancelRefetch?: boolean }) => Promise<unknown>;
};

// refetches data read before the latest own tx,
// so the outdated-data guard in tx builders doesn't fire on valid submits
export const useRefetchOnTxBlock = (query: BlockScopedQuery) => {
  const { latestTxBlock } = useLidoSDK();
  const dataBlock = query.data?.blockNumber;
  const { refetch } = query;

  useEffect(() => {
    if (!isBehindTxBlock(dataBlock, latestTxBlock)) return;
    // join an in-flight fetch instead of cancelling it (onSubmit awaits its own refetch);
    // if the joined fetch returns an older block, `dataBlock` changes and this re-runs
    void refetch({ cancelRefetch: false });
  }, [latestTxBlock, dataBlock, refetch]);
};
