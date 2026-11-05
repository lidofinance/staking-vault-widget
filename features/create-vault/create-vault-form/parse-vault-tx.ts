import {
  type Address,
  type Hash,
  type Log,
  isAddressEqual,
  parseEventLogs,
} from 'viem';

import { VaultFactoryAbi } from '@lidofinance/lido-ethereum-sdk/stvault';

import type { TransactionResponse } from 'modules/web3';

export type VaultFactoryResolver = (
  chainId: TransactionResponse['chainId'],
) => Address | undefined;

type ParsedVaultTx = {
  vaultAddress: Address | null;
  txHash: Hash | null;
};

/**
 * Extracts the created vault address from the user's own create-vault tx.
 *
 * In the AA (EIP-5792) flow `receipts` holds the full on-chain tx receipt, which
 * in a shared 4337 bundle can contain other users' operations (and their
 * `VaultCreated` events). The wallet's `callStatus.receipts` are scoped to the
 * user's own calls, so they are the log source there. Logs are additionally
 * filtered by the factory emitter, and an address is returned only when exactly
 * one `VaultCreated` event is found — anything ambiguous yields `null`.
 *
 * The factory is resolved for the chain the tx was submitted on
 * (`result.chainId`), not the currently connected one, so the result survives
 * a network switch after submission.
 */
export const parseVaultTx = (
  result: TransactionResponse,
  resolveFactory: VaultFactoryResolver,
): ParsedVaultTx => {
  const { receipts } = result;
  const factoryAddress = resolveFactory(result.chainId);
  const scopedReceipts = result.isAA ? result.callStatus.receipts : undefined;

  const lastReceipt = receipts?.at(-1);
  const txHash =
    lastReceipt?.transactionHash ??
    scopedReceipts?.at(-1)?.transactionHash ??
    null;

  const scopedLogs =
    scopedReceipts && scopedReceipts.length > 0
      ? scopedReceipts.flatMap((receipt) => receipt.logs)
      : lastReceipt?.logs;

  if (!factoryAddress || !scopedLogs || scopedLogs.length === 0)
    return { vaultAddress: null, txHash };

  const factoryLogs = scopedLogs.filter(
    (log) => !!log.address && isAddressEqual(log.address, factoryAddress),
  );

  const events = parseEventLogs({
    abi: VaultFactoryAbi,
    // wallet call receipts carry only address/data/topics, which is all
    // parseEventLogs needs for decoding
    logs: factoryLogs as Log[],
    strict: true,
    eventName: 'VaultCreated',
  });

  if (events.length !== 1) return { vaultAddress: null, txHash };

  return { vaultAddress: events[0].args.vault, txHash };
};
