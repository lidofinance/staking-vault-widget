export const isBigint = (value: unkown): value is bigint => {
  return typeof value === 'bigint';
};
