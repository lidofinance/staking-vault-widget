// Runs fn unless the previous run with the same lock is still in progress.
// The lock is synchronous, so a double click or retry fired before re-render is dropped.
export const runExclusive = async <T, F>(
  lock: { current: boolean },
  fn: () => Promise<T>,
  fallback: F,
): Promise<T | F> => {
  if (lock.current) return fallback;
  lock.current = true;
  try {
    return await fn();
  } finally {
    lock.current = false;
  }
};
