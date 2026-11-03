import { describe, test, expect, jest } from '@jest/globals';

import { runExclusive } from '../run-exclusive';

const deferred = () => {
  let resolve: (value: boolean) => void = () => undefined;
  const promise = new Promise<boolean>((_resolve) => (resolve = _resolve));
  return { promise, resolve };
};

describe('runExclusive', () => {
  test('repeated submissions while in progress produce one request', async () => {
    const lock = { current: false };
    const request = deferred();
    const send = jest.fn(() => request.promise);

    const first = runExclusive(lock, send, false);
    const second = runExclusive(lock, send, false);
    const third = runExclusive(lock, send, false);

    expect(send).toHaveBeenCalledTimes(1);
    await expect(second).resolves.toBe(false);
    await expect(third).resolves.toBe(false);

    request.resolve(true);
    await expect(first).resolves.toBe(true);
  });

  test('releases the lock after completion', async () => {
    const lock = { current: false };
    const send = jest.fn(async () => true);

    await runExclusive(lock, send, false);
    await runExclusive(lock, send, false);

    expect(send).toHaveBeenCalledTimes(2);
    expect(lock.current).toBe(false);
  });

  test('releases the lock after an error', async () => {
    const lock = { current: false };

    await expect(
      runExclusive(
        lock,
        async () => {
          throw new Error('rejected');
        },
        0,
      ),
    ).rejects.toThrow('rejected');
    expect(lock.current).toBe(false);
  });
});
