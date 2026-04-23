export const isNumber = (
  value: number | string | bigint | null | undefined | boolean | object,
): value is number => {
  return typeof value === 'number' && !isNaN(value);
};
