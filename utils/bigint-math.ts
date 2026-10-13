export const bigIntMax = (...args: bigint[]) =>
  args.reduce((a, b) => (a > b ? a : b));
export const bigIntMin = (...args: bigint[]) =>
  args.reduce((a, b) => (a < b ? a : b));
export const bigIntClampZero = (value: bigint) => (value < 0n ? 0n : value);
