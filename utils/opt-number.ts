export const optNumber = (
  value: string | number | undefined,
): number | undefined => {
  return value != null && value !== '' ? Number(value) : undefined;
};
