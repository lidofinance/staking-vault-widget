// data read at `dataBlock` misses the effects of the latest own tx
export const isBehindTxBlock = (
  dataBlock: bigint | undefined,
  latestTxBlock: bigint | undefined,
): boolean =>
  latestTxBlock !== undefined &&
  dataBlock !== undefined &&
  dataBlock < latestTxBlock;
