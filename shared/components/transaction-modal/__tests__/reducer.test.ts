import { describe, test, expect } from '@jest/globals';

import { transactionModalReducer } from '../reducer';
import type { TransactionModalState } from '../types';

const ownRetry = () => {};
const otherRetry = () => {};

const state = (onRetry?: () => void): TransactionModalState => ({
  isOpen: true,
  isBatch: false,
  stage: 'error',
  onRetry,
  details: { actionLoadingText: '', actionCompleteText: '' },
});

describe('transactionModalReducer disable-retry', () => {
  test('clears Retry of the attempt that owns the modal', () => {
    const next = transactionModalReducer(state(ownRetry), {
      type: 'disable-retry',
      onRetry: ownRetry,
    });

    expect(next.onRetry).toBeUndefined();
    expect(next.isOpen).toBe(true);
  });

  test('keeps Retry when another sender took over the modal', () => {
    const prev = state(otherRetry);
    const next = transactionModalReducer(prev, {
      type: 'disable-retry',
      onRetry: ownRetry,
    });

    expect(next).toBe(prev);
    expect(next.onRetry).toBe(otherRetry);
  });
});
