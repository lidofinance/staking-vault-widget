export const getTestId = (dataTestId: string | undefined, suffix: string) =>
  dataTestId ? `${dataTestId}-${suffix}` : undefined;
