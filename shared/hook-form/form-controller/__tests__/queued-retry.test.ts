import { describe, test, expect } from '@jest/globals';

import { canRunQueuedRetry, type QueuedRetry } from '../queued-retry';

const formRetry = () => {};
const reportRetry = () => {};

// the form's error is shown in session 3, and Retry was clicked on it
const queued: QueuedRetry = { onRetry: formRetry, sessionId: 3 };
const modal = (
  overrides: Partial<Parameters<typeof canRunQueuedRetry>[0]> = {},
) => ({
  isOpen: true,
  stage: 'error' as const,
  onRetry: formRetry,
  sessionId: 3,
  ...overrides,
});

describe('canRunQueuedRetry', () => {
  test('runs when the form is ready and the modal still shows that error', () => {
    // e.g. Retry clicked during the cleanup refetch of the same failed attempt
    expect(canRunQueuedRetry(modal(), queued)).toBe(true);
  });

  test('a click on an old error is dropped once a newer attempt began', () => {
    // double click: the first click started session 4, which failed again
    expect(canRunQueuedRetry(modal({ sessionId: 4 }), queued)).toBe(false);
  });

  test("another sender's error is not this form's retry", () => {
    expect(
      canRunQueuedRetry(modal({ onRetry: reportRetry, sessionId: 5 }), queued),
    ).toBe(false);
  });

  test('retry disabled meanwhile (e.g. data is not fresh)', () => {
    expect(canRunQueuedRetry(modal({ onRetry: undefined }), queued)).toBe(
      false,
    );
  });

  test('modal closed or not in error', () => {
    expect(canRunQueuedRetry(modal({ isOpen: false }), queued)).toBe(false);
    expect(canRunQueuedRetry(modal({ stage: 'success' }), queued)).toBe(false);
  });
});
