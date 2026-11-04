import { describe, test, expect } from '@jest/globals';

import { isUserRejectedError } from '../is-user-rejected-error';

describe('isUserRejectedError', () => {
  test('wallet rejection code', () => {
    expect(isUserRejectedError({ code: 4001 })).toBe(true);
    expect(isUserRejectedError({ code: 200001 })).toBe(true);
  });

  test('rejection wrapped by viem', () => {
    const rejected = Object.assign(new Error('User rejected the request.'), {
      name: 'UserRejectedRequestError',
      code: 4001,
    });
    const wrapped = Object.assign(new Error('Transaction execution failed'), {
      name: 'TransactionExecutionError',
      cause: rejected,
    });
    expect(isUserRejectedError(wrapped)).toBe(true);
  });

  test('rejection by message', () => {
    expect(
      isUserRejectedError(
        new Error(
          'MetaMask Tx Signature: User denied transaction signature. The user rejected the request',
        ),
      ),
    ).toBe(true);
  });

  test('safe-app cancel', () => {
    expect(
      isUserRejectedError({
        code: -32000,
        message: 'User rejected transaction',
      }),
    ).toBe(true);
  });

  test('other failures are not rejections', () => {
    expect(isUserRejectedError(new Error('Transaction failed'))).toBe(false);
    expect(
      isUserRejectedError({ code: -32000, message: 'insufficient funds' }),
    ).toBe(false);
    expect(isUserRejectedError({ code: 'CALL_EXCEPTION' })).toBe(false);
    expect(isUserRejectedError(undefined)).toBe(false);
  });
});
