import { describe, test, expect } from '@jest/globals';

import { transactionModalReducer } from '../reducer';
import type { TransactionModalState } from '../types';

const ownRetry = () => {};
const otherRetry = () => {};

const state = (
  onRetry?: () => void,
  overrides: Partial<TransactionModalState> = {},
): TransactionModalState => ({
  sessionId: 2,
  isOpen: true,
  isBatch: false,
  stage: 'error',
  onRetry,
  details: { actionLoadingText: '', actionCompleteText: '' },
  ...overrides,
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

describe('transactionModalReducer sessions', () => {
  // session 2 (e.g. create vault) is in progress, session 1 is an older send still waiting
  const current = () =>
    state(ownRetry, { stage: 'awaiting', isOpen: false, sessionId: 2 });

  test("a late error of an older session doesn't take over the current one", () => {
    const prev = current();
    const next = transactionModalReducer(prev, {
      type: 'stage',
      sessionId: 1,
      stage: 'error',
      details: { errorText: 'older tx failed' },
    });

    // no error shown and no Retry offered for the current form
    expect(next).toBe(prev);
  });

  test("an older session can't take Retry away from the current one", () => {
    const prev = state(ownRetry, { sessionId: 2 });
    const next = transactionModalReducer(prev, {
      type: 'stage',
      sessionId: 1,
      stage: 'error',
      allowRetry: false,
    });

    expect(next.onRetry).toBe(ownRetry);
  });

  test('stages of the current session apply as before', () => {
    const next = transactionModalReducer(current(), {
      type: 'stage',
      sessionId: 2,
      stage: 'error',
      allowRetry: false,
      details: { errorText: 'failed' },
    });

    expect(next).toMatchObject({
      isOpen: true,
      stage: 'error',
      onRetry: undefined,
      details: { errorText: 'failed' },
    });
  });

  test('init starts a clean session without details of the previous one', () => {
    const prev = state(otherRetry, {
      sessionId: 1,
      details: {
        actionLoadingText: 'old',
        actionCompleteText: 'old',
        errorText: 'old error',
        transactionId: '0xold',
      },
    });
    const next = transactionModalReducer(prev, {
      type: 'init',
      sessionId: 2,
      isBatch: false,
      isOpen: false,
      stage: 'none',
      onRetry: ownRetry,
      details: { actionLoadingText: 'new', actionCompleteText: 'new' },
    });

    expect(next.sessionId).toBe(2);
    expect(next.onRetry).toBe(ownRetry);
    expect(next.details).toEqual({
      actionLoadingText: 'new',
      actionCompleteText: 'new',
    });
  });
});
