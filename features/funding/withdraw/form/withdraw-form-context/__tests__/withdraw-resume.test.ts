import { describe, test, expect } from '@jest/globals';

import {
  getWithdrawResumeKey,
  skipsWithdrawableCheck,
} from '../withdraw-resume';

const VAULT = '0x00000000000000000000000000000000000000aa';
const RECIPIENT = '0xAbCdEf0000000000000000000000000000000001';
const base = { amount: 8n, token: 'wETH' };

describe('getWithdrawResumeKey', () => {
  test('raw form values match the validated values the sender used', () => {
    // the address schema trims and lowercases the recipient
    expect(
      getWithdrawResumeKey(VAULT, { ...base, recipient: ` ${RECIPIENT} ` }),
    ).toBe(
      getWithdrawResumeKey(VAULT, {
        ...base,
        recipient: RECIPIENT.toLowerCase(),
      }),
    );
  });

  test('another amount, token, recipient or vault is another operation', () => {
    const key = getWithdrawResumeKey(VAULT, { ...base, recipient: RECIPIENT });
    expect(
      getWithdrawResumeKey(VAULT, {
        ...base,
        amount: 9n,
        recipient: RECIPIENT,
      }),
    ).not.toBe(key);
    expect(
      getWithdrawResumeKey(VAULT, {
        ...base,
        token: 'ETH',
        recipient: RECIPIENT,
      }),
    ).not.toBe(key);
    expect(getWithdrawResumeKey(VAULT, { ...base, recipient: VAULT })).not.toBe(
      key,
    );
    expect(
      getWithdrawResumeKey(RECIPIENT, { ...base, recipient: RECIPIENT }),
    ).not.toBe(key);
  });
});

describe('skipsWithdrawableCheck', () => {
  test('a confirmed withdraw is no longer in the withdrawable balance', () => {
    // withdraw confirmed, wrap failed: a resubmit only wraps
    expect(skipsWithdrawableCheck(new Set(['withdraw']))).toBe(true);
  });

  test('nothing confirmed: the amount is checked as usual', () => {
    expect(skipsWithdrawableCheck(new Set())).toBe(false);
    expect(skipsWithdrawableCheck(new Set(['wrap']))).toBe(false);
  });
});
