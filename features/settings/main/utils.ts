export const shouldIncrementTxCounter = (
  value: string,
  defaultValue: number | undefined,
  custom: string | undefined,
) => {
  return (
    (value !== 'other' && Number(value) !== defaultValue) ||
    (value === 'other' && Boolean(custom))
  );
};

export const getHoursDifference = (dateA: Date, dateB: Date) => {
  return Math.ceil((dateA.getTime() - dateB.getTime()) / (1000 * 60 * 60));
};
