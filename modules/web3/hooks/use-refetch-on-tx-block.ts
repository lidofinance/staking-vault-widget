import { useEffect } from 'react';

import { useLidoSDK } from 'modules/web3';

import { isBehindTxBlock } from './is-behind-tx-block';
import {
  refetchToTxBlock,
  type BlockScopedRefetch,
} from './refetch-to-tx-block';

type BlockScopedQuery = {
  data?: { blockNumber: bigint };
  refetch: BlockScopedRefetch;
};

// refetches data read before the latest own tx,
// so the outdated-data guard in tx builders doesn't fire on valid submits
export const useRefetchOnTxBlock = (query: BlockScopedQuery) => {
  const { latestTxBlock, getLatestTxBlock } = useLidoSDK();
  const dataBlock = query.data?.blockNumber;
  const { refetch } = query;

  useEffect(() => {
    if (!isBehindTxBlock(dataBlock, latestTxBlock)) return;
    let isActive = true;
    void refetchToTxBlock(refetch, getLatestTxBlock, () => isActive);
    return () => {
      isActive = false;
    };
  }, [latestTxBlock, dataBlock, refetch, getLatestTxBlock]);
};
