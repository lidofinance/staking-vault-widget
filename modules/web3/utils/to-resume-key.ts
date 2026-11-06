// Stable fingerprint of submitted values for SendTransactionArguments.resumeKey
export const toResumeKey = (values: unknown): string =>
  JSON.stringify(values, (_, value: unknown) =>
    typeof value === 'bigint' ? value.toString() : value,
  );
