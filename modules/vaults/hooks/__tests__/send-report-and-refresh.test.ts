import { describe, test, expect, jest } from '@jest/globals';

import { sendReportAndRefresh } from '../send-report-and-refresh';

const refreshMock = () => jest.fn(() => Promise.resolve());

describe('sendReportAndRefresh', () => {
  test('refreshes the vault state after a successful report', async () => {
    // e.g. an AA batch without receipts: no tx block to trigger block-keyed refetches
    const refresh = refreshMock();
    await expect(
      sendReportAndRefresh(() => Promise.resolve({ success: true }), refresh),
    ).resolves.toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  test('refreshes after a failed or already applied report', async () => {
    const refresh = refreshMock();
    await expect(
      sendReportAndRefresh(() => Promise.resolve({ success: false }), refresh),
    ).resolves.toBe(false);
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  test('refreshes even if sending throws, and keeps the error', async () => {
    const refresh = refreshMock();
    await expect(
      sendReportAndRefresh(() => Promise.reject(new Error('boom')), refresh),
    ).rejects.toThrow('boom');
    expect(refresh).toHaveBeenCalledTimes(1);
  });

  // refresh that stays pending until released, to see whether the attempt waits for it
  const pendingRefresh = () => {
    let release: () => void = () => {};
    const refresh = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          release = resolve;
        }),
    );
    return { refresh, release: () => release() };
  };

  const isSettled = async (promise: Promise<unknown>) => {
    let settled = false;
    void promise.then(
      () => (settled = true),
      () => (settled = true),
    );
    await new Promise((resolve) => setTimeout(resolve, 0));
    return settled;
  };

  test('after a success the attempt waits for the refresh, so another click is dropped meanwhile', async () => {
    const { refresh, release } = pendingRefresh();
    const attempt = sendReportAndRefresh(
      () => Promise.resolve({ success: true }),
      refresh,
    );

    // the busy lock holds while the report freshness reloads
    expect(await isSettled(attempt)).toBe(false);
    release();
    await expect(attempt).resolves.toBe(true);
  });

  test("after a failure the attempt doesn't wait, so a Retry on its error is not dropped", async () => {
    const { refresh, release } = pendingRefresh();
    const attempt = sendReportAndRefresh(
      () => Promise.resolve({ success: false }),
      refresh,
    );

    expect(await isSettled(attempt)).toBe(true);
    expect(refresh).toHaveBeenCalledTimes(1);
    release();
  });

  test('a failed refresh does not fail the attempt', async () => {
    await expect(
      sendReportAndRefresh(
        () => Promise.resolve({ success: true }),
        () => Promise.reject(new Error('refetch failed')),
      ),
    ).resolves.toBe(true);
  });
});
