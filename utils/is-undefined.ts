export const isUndefined = (
  value: number | string | bigint | null | undefined | boolean | object,
): value is undefined => {
  return typeof value === 'undefined';
};
