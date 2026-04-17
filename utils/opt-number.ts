export const optNumber = (
  value: string | number | undefined,
): number | undefined => {
  return value != null ? Number(value) : undefined;
};
