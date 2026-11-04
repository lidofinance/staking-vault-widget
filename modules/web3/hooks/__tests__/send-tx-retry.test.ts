import { describe, test, expect } from '@jest/globals';

import {
  getFailedBatchOutcome,
  getRetryDecision,
  resolveResumeProgress,
  skipCompletedSteps,
  type RetryDecisionInput,
} from '../send-tx-retry';

const success = { status: 'success' as const };
const reverted = { status: 'reverted' as const };

const decide = (input: Partial<RetryDecisionInput>) =>
  getRetryDecision({
    isRetryableError: undefined,
    isUnconfirmed: false,
    receipts: [],
    executedCallsCount: 0,
    isAA: false,
    isTracked: false,
    allowRetryAfterPartialSuccess: false,
    isUserRejected: false,
    hasCompletedSteps: false,
    ...input,
  });

describe('resolveResumeProgress', () => {
  test('keeps confirmed steps for the same key', () => {
    const progress = resolveResumeProgress(undefined, '0xUser:{"amount":"1"}');
    progress?.completedSteps.add('withdraw');

    const resumed = resolveResumeProgress(progress, '0xUser:{"amount":"1"}');

    expect(resumed).toBe(progress);
    expect(resumed?.completedSteps.has('withdraw')).toBe(true);
  });

  test('starts over for other values or another account', () => {
    const progress = resolveResumeProgress(undefined, '0xUser:{"amount":"1"}');
    progress?.completedSteps.add('withdraw');

    expect(
      resolveResumeProgress(progress, '0xUser:{"amount":"2"}')?.completedSteps
        .size,
    ).toBe(0);
    expect(
      resolveResumeProgress(progress, '0xOther:{"amount":"1"}')?.completedSteps
        .size,
    ).toBe(0);
  });

  test('is disabled without a key', () => {
    expect(resolveResumeProgress(undefined, undefined)).toBeUndefined();
  });
});

type Tx = { to: string; stepKey?: string };

describe('skipCompletedSteps', () => {
  const report: Tx = { to: 'oracle' };
  const withdraw: Tx = { to: 'dashboard', stepKey: 'withdraw' };
  const wrap: Tx = { to: 'weth', stepKey: 'wrap' };

  test('never resends a confirmed withdrawal', () => {
    expect(
      skipCompletedSteps([report, withdraw, wrap], new Set(['withdraw'])),
    ).toEqual([report, wrap]);
  });

  test('never resends confirmed unwrap and fund', () => {
    const unwrap: Tx = { to: 'weth', stepKey: 'unwrap' };
    const fund: Tx = { to: 'dashboard', stepKey: 'fund' };
    const mint: Tx = { to: 'dashboard', stepKey: 'mint' };

    expect(
      skipCompletedSteps(
        [unwrap, fund, report, mint],
        new Set(['unwrap', 'fund']),
      ),
    ).toEqual([report, mint]);
  });

  test('keeps steps without key, they are rebuilt from live state', () => {
    expect(skipCompletedSteps([report], new Set(['withdraw']))).toEqual([
      report,
    ]);
  });
});

describe('getFailedBatchOutcome', () => {
  test('collects executed calls of a partially failed batch', () => {
    const outcome = getFailedBatchOutcome({
      receipts: [success, reverted],
      statusCode: 600,
    });
    expect(outcome.executedReceipts).toEqual([success]);
    expect(outcome.isUnknown).toBe(false);
  });

  test('partial revert without receipts is an unknown outcome', () => {
    expect(getFailedBatchOutcome({ statusCode: 600 }).isUnknown).toBe(true);
  });

  test('complete failure is a known outcome', () => {
    const outcome = getFailedBatchOutcome({
      receipts: [reverted],
      statusCode: 500,
    });
    expect(outcome.executedReceipts).toEqual([]);
    expect(outcome.isUnknown).toBe(false);
  });
});

describe('getRetryDecision', () => {
  test('allows retry when nothing was sent', () => {
    expect(decide({}).canRetry).toBe(true);
  });

  test('respects non-retryable errors', () => {
    expect(decide({ isRetryableError: false }).canRetry).toBe(false);
  });

  test('unknown outcome prevents retry, even if the caller allows partial retry', () => {
    expect(
      decide({ isUnconfirmed: true, allowRetryAfterPartialSuccess: true })
        .canRetry,
    ).toBe(false);
    expect(
      decide({ isUnconfirmed: true, isRetryableError: true }).canRetry,
    ).toBe(false);
  });

  test('single reverted tx is a definite result and can be retried', () => {
    const decision = decide({ receipts: [reverted] });
    expect(decision.isPartialSuccess).toBe(false);
    expect(decision.canRetry).toBe(true);
  });

  test('partial success prevents retry by default', () => {
    const decision = decide({ receipts: [success, reverted] });
    expect(decision.isPartialSuccess).toBe(true);
    expect(decision.canRetry).toBe(false);
  });

  test('partial success allows retry when the caller rebuilds or resumes txs', () => {
    expect(
      decide({ receipts: [success], allowRetryAfterPartialSuccess: true })
        .canRetry,
    ).toBe(true);
  });

  test('partially executed AA batch with step tracking prevents retry', () => {
    expect(
      decide({
        isAA: true,
        isTracked: true,
        executedCallsCount: 1,
        allowRetryAfterPartialSuccess: true,
      }).canRetry,
    ).toBe(false);
  });

  test('partially executed AA batch rebuilt from live state can be retried', () => {
    expect(
      decide({
        isAA: true,
        executedCallsCount: 1,
        allowRetryAfterPartialSuccess: true,
      }).canRetry,
    ).toBe(true);
  });

  test('user stop after confirmed steps aborts the operation and prevents retry', () => {
    const decision = decide({
      isUserRejected: true,
      isTracked: true,
      hasCompletedSteps: true,
      receipts: [success],
      allowRetryAfterPartialSuccess: true,
    });
    expect(decision.isAborted).toBe(true);
    expect(decision.canRetry).toBe(false);
  });

  test('user stop on a retry counts steps confirmed in previous attempts', () => {
    const decision = decide({
      isUserRejected: true,
      isTracked: true,
      hasCompletedSteps: true,
      allowRetryAfterPartialSuccess: true,
    });
    expect(decision.isAborted).toBe(true);
    expect(decision.canRetry).toBe(false);
  });

  test('user stop before any confirmed step can be retried', () => {
    const decision = decide({ isUserRejected: true, isTracked: true });
    expect(decision.isAborted).toBe(false);
    expect(decision.canRetry).toBe(true);
  });

  test('confirmed report without a step key does not abort, it is rebuilt from live state', () => {
    const decision = decide({
      isUserRejected: true,
      isTracked: true,
      receipts: [success],
      allowRetryAfterPartialSuccess: true,
    });
    expect(decision.isAborted).toBe(false);
    expect(decision.canRetry).toBe(true);
  });

  test('untracked flows rebuilt from live state keep retry after a user stop', () => {
    const decision = decide({
      isUserRejected: true,
      receipts: [success],
      allowRetryAfterPartialSuccess: true,
    });
    expect(decision.isAborted).toBe(false);
    expect(decision.canRetry).toBe(true);
  });

  test('other failures after confirmed steps keep the resume', () => {
    const decision = decide({
      isTracked: true,
      hasCompletedSteps: true,
      receipts: [success, reverted],
      allowRetryAfterPartialSuccess: true,
    });
    expect(decision.isAborted).toBe(false);
    expect(decision.canRetry).toBe(true);
  });
});
