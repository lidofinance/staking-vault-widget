import { useMemo } from 'react';

import { appPaths } from 'consts/routing';
import { useDappStatus } from 'modules/web3';

import type { TransactionResponse } from 'modules/web3';
import { getFallbackVaultList, parseVaultTx } from './utils';
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

// the vault list to send the user to when the vault address can't be confirmed
export const useFallbackVaultList = (expected: VaultTxExpected | null) => {
  const { address } = useDappStatus();
  const list = getFallbackVaultList(expected?.owners, address);
  return {
    list,
    path: list === 'my' ? appPaths.myVaults : appPaths.vaults.all,
  };
};
