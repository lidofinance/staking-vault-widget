export const isBoolean = (
  value: number | string | bigint | null | undefined | boolean,
): value is boolean => {
  return typeof value === 'boolean';
};
