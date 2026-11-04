import { describe, test, expect } from '@jest/globals';

import { isBehindTxBlock } from '../is-behind-tx-block';

describe('isBehindTxBlock', () => {
  test('no own tx yet → not behind', () => {
    expect(isBehindTxBlock(10n, undefined)).toBe(false);
  });

  test('no data yet → not behind', () => {
    expect(isBehindTxBlock(undefined, 10n)).toBe(false);
  });

  test('data read before the tx block → behind', () => {
    expect(isBehindTxBlock(9n, 10n)).toBe(true);
  });

  test('data read at the tx block → not behind', () => {
    expect(isBehindTxBlock(10n, 10n)).toBe(false);
  });

  test('data read after the tx block → not behind', () => {
    expect(isBehindTxBlock(11n, 10n)).toBe(false);
  });
});
