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

  test('the attempt ends only after the refresh, so Retry stays locked until then', async () => {
    const order: string[] = [];
    await sendReportAndRefresh(
      async () => {
        order.push('send');
        return { success: true };
      },
      async () => {
        order.push('refresh');
      },
    );
    order.push('done');
    expect(order).toEqual(['send', 'refresh', 'done']);
  });
});
