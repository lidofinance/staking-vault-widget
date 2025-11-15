export const ceilDivBigint = (
  numerator: bigint,
  denominator: bigint,
): bigint => {
  const result = numerator / denominator;
  return numerator % denominator === 0n ? result : result + 1n;
};
