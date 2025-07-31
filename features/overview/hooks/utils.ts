// Because we operate with ETH, stETH and etc at 18 decimals,
// we can cut lower 8 decimals without losing precision in chart generation
// yet prevent Number.MAX_SAFE_INTEGER issues
export const normalizeChartBN = (value: bigint): number => {
  return Number(value / 1_0000_0000n);
};
