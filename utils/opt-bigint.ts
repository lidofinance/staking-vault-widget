type OptBigintValue = string | number | undefined | null;
type OptBigintResult<T extends OptBigintValue> = T extends string | number
  ? bigint
  : undefined;

export const optBigint = <T extends OptBigintValue>(
  value: T,
): OptBigintResult<T> => {
  return (
    value != null && value !== '' ? BigInt(value) : undefined
  ) as OptBigintResult<T>;
};
