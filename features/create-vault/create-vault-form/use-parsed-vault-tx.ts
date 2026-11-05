import { useMemo } from 'react';

import type { TransactionResponse } from 'modules/web3';
import { parseVaultTx } from './utils';
import type { ParsedVaultTx, VaultTxExpected } from './utils';

export const useParsedVaultTx = (
  result: TransactionResponse | undefined,
  expected: VaultTxExpected | null,
): ParsedVaultTx | null =>
  useMemo(() => {
    if (!result) return null;
    if (!expected)
      return { vaultAddress: null, txHash: null, reason: 'no-expected' };
    return parseVaultTx(result, expected);
  }, [result, expected]);
