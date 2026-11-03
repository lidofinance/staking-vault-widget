import { describe, test, expect } from '@jest/globals';

import { toResumeKey } from '../to-resume-key';

describe('toResumeKey', () => {
  test('same values give the same key, bigint included', () => {
    expect(toResumeKey({ vault: '0x1', amount: 10n })).toBe(
      toResumeKey({ vault: '0x1', amount: 10n }),
    );
  });

  test('another amount gives another key, so progress is not reused', () => {
    expect(toResumeKey({ amount: 1n })).not.toBe(toResumeKey({ amount: 2n }));
  });
});
