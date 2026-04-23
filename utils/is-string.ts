export const isString = (
  value: number | string | bigint | null | undefined | boolean | object,
): value is string => {
  return typeof value === 'string';
};
