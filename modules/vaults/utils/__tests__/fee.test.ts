import { describe, test, expect } from '@jest/globals';

import { feePercentToBasisPoints, isSameFee, isWholeBasisPoints } from '../fee';

describe('fee in basis points', () => {
  test('converts without float noise', () => {
    // a plain Math.floor(fee * 10000 / 100) gives 56 and 112 here
    expect(feePercentToBasisPoints('0.57')).toBe(57);
    expect(feePercentToBasisPoints(0.57)).toBe(57);
    expect(feePercentToBasisPoints(1.13)).toBe(113);
    expect(feePercentToBasisPoints(1)).toBe(100);
  });

  test('accepts up to 0.01% precision', () => {
    expect(isWholeBasisPoints('1')).toBe(true);
    expect(isWholeBasisPoints('0.57')).toBe(true);
    expect(isWholeBasisPoints(1.25)).toBe(true);
  });

  test('rejects precision beyond basis points instead of rounding it', () => {
    // would be sent as 1%, equal to a current 1% fee: no tx, but "Submit 1 transaction"
    expect(isWholeBasisPoints('1.001')).toBe(false);
    expect(isWholeBasisPoints(0.005)).toBe(false);
  });

  test('same fee in different notation is not a change', () => {
    expect(isSameFee('1.00', '1')).toBe(true);
    expect(isSameFee(1, '1.0')).toBe(true);
    expect(isSameFee('1.01', '1')).toBe(false);
  });

  test('empty or missing values never equal a fee', () => {
    // '' would convert to 0 bp and match a zero fee
    expect(isSameFee('', '0')).toBe(false);
    expect(isSameFee(undefined, '0')).toBe(false);
    expect(isSameFee('0', undefined)).toBe(false);
  });
});
