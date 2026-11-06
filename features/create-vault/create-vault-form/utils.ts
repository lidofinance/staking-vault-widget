import {
  encodeFunctionData,
  isAddress,
  isAddressEqual,
  parseEventLogs,
} from 'viem';
import type { Address, Hash, Hex, Log } from 'viem';

import { VaultFactoryAbi } from '@lidofinance/lido-ethereum-sdk/stvault';
import { feePercentToBasisPoints } from 'modules/vaults/utils/fee';
import { VAULTS_CONNECT_DEPOSIT, VAULTS_ROOT_ROLES_MAP } from 'modules/vaults';

import type { CreateVaultSchema } from '../types';
import type { TransactionResponse } from 'modules/web3';
import { createVaultSchema } from './validation';

export const schemaToTx = (unparsedValues: CreateVaultSchema) => {
  const values = createVaultSchema.parse(unparsedValues);
  const { confirmExpiry, feeRate, nodeOperatorManager, nodeOperator } = values;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  // toFixed before floor: 0.57% must become 57 bp, not 56 (0.57 * 100 = 56.99999999999999)
  const nodeOperatorFeeRateFormatted = BigInt(feePercentToBasisPoints(feeRate));

  // first manager goes to factory as direct argument
  const [defaultAdmin, ...restAdmins] = values.vaultOwner;

  return {
    data: encodeFunctionData({
      abi: VaultFactoryAbi,
      functionName: 'createVaultWithDashboard',
      args: [
        defaultAdmin.value,
        nodeOperator,
        nodeOperatorManager,
        nodeOperatorFeeRateFormatted,
        confirmExpiryFormatted,
        restAdmins.map((admin) => ({
          role: VAULTS_ROOT_ROLES_MAP['defaultAdmin'],
          account: admin.value,
        })),
      ],
    }),
    value: VAULTS_CONNECT_DEPOSIT,
    // the parsed admin the factory emits in DashboardCreated, to find the created vault
    defaultAdmin: defaultAdmin.value,
    // every submitted owner gets the default admin role (the first via the factory argument)
    owners: values.vaultOwner.map((owner) => owner.value),
  };
};

type VaultTxReceipt = {
  transactionHash: Hash;
  logs: readonly { address: Hex; data: Hex; topics: readonly Hex[] }[];
};

// what the submitted tx is known to create: logs from other contracts or other users'
// vaults (e.g. other UserOps in the same bundle tx) must not be taken for it
export type VaultTxExpected = {
  factory: Address;
  defaultAdmin: Address;
  // all default admins of the new vault, see getFallbackVaultList
  owners: Address[];
};

// Where to send the user when the created vault can't be confirmed. My stVaults lists
// vaults the connected address is a default admin of, but the creator may set other
// addresses as the only owners; then the vault is found only in All stVaults.
export const getFallbackVaultList = (
  owners: readonly Address[] | undefined,
  connected: Address | undefined,
): 'my' | 'all' =>
  owners &&
  connected &&
  owners.some((owner) => isAddressEqual(owner, connected))
    ? 'my'
    : 'all';

// why the created vault can't be told from the tx: for diagnostics only, the user sees one notice
export type VaultTxUnresolvedReason =
  | 'no-expected' // factory or default admin to check against is unknown
  | 'no-receipts'
  | 'no-factory-events'
  | 'no-match' // no vault from the factory for this default admin
  | 'ambiguous';

export type ParsedVaultTx =
  | { vaultAddress: Address; txHash: Hash; reason: null }
  | {
      vaultAddress: null;
      txHash: Hash | null;
      reason: VaultTxUnresolvedReason;
    };

// A wallet receipt is unvalidated data: one without a hash can't be told apart from
// others and is skipped, missing logs count as none, so a malformed one can't crash render.
const toScannableReceipt = (receipt: unknown): VaultTxReceipt | null => {
  const { transactionHash, logs } = (receipt ?? {}) as Partial<VaultTxReceipt>;
  if (typeof transactionHash !== 'string') return null;
  return { transactionHash, logs: Array.isArray(logs) ? logs : [] };
};

export const parseVaultTx = (
  { receipts, isAA, callStatus }: TransactionResponse,
  { factory, defaultAdmin }: VaultTxExpected,
): ParsedVaultTx => {
  // In AA only the last wallet receipt is re-read with confirmations (and that may fail
  // after the wallet reported success), while the factory event may be in any of the
  // wallet's receipts: all of them are scanned, each tx once (by hash, case-insensitively:
  // wallets may differ in casing). For a tx in both lists the confirmed receipt is kept:
  // it is read from the RPC, while a wallet receipt is unvalidated and may lack logs.
  const byHash = new Map<string, VaultTxReceipt>();
  for (const receipt of isAA ? callStatus.receipts ?? [] : []) {
    const scannable = toScannableReceipt(receipt);
    const key = scannable && scannable.transactionHash.toLowerCase();
    if (scannable && key && !byHash.has(key)) byHash.set(key, scannable);
  }
  for (const receipt of receipts ?? []) {
    const key = receipt.transactionHash.toLowerCase();
    // re-added, so the confirmed (latest) tx stays last
    byHash.delete(key);
    byHash.set(key, receipt);
  }
  const sourceReceipts = [...byHash.values()];

  if (sourceReceipts.length === 0)
    return { vaultAddress: null, txHash: null, reason: 'no-receipts' };

  // shown when the vault can't be resolved: the receipts are of one submit, the last is the latest tx
  const lastTxHash = sourceReceipts[sourceReceipts.length - 1].transactionHash;

  // all receipts are scanned: the wallet may return several in any order
  const dashboards = sourceReceipts.flatMap((receipt) =>
    parseEventLogs({
      abi: VaultFactoryAbi,
      // only topics and data are decoded; wallet logs lack the block/tx fields of a full Log
      logs: (receipt.logs as unknown as Log[]).filter(
        (log) =>
          // wallet logs are not validated: isAddressEqual throws on a malformed address,
          // and decoding needs topics and data
          isAddress(log?.address, { strict: false }) &&
          isAddressEqual(log.address, factory) &&
          Array.isArray(log.topics) &&
          typeof log.data === 'string',
      ),
      strict: true,
      eventName: 'DashboardCreated',
    }).map((log) => ({ ...log.args, txHash: receipt.transactionHash })),
  );

  if (dashboards.length === 0)
    return {
      vaultAddress: null,
      txHash: lastTxHash,
      reason: 'no-factory-events',
    };

  // DashboardCreated from the factory binds the vault to its default admin,
  // so the match is the vault created for this submit
  const matches = dashboards.filter(({ admin }) =>
    isAddressEqual(admin, defaultAdmin),
  );

  if (matches.length === 0)
    return { vaultAddress: null, txHash: lastTxHash, reason: 'no-match' };
  // the tx creates exactly one vault; anything else is ambiguous and not shown
  if (matches.length > 1)
    return { vaultAddress: null, txHash: lastTxHash, reason: 'ambiguous' };

  return {
    vaultAddress: matches[0].vault,
    txHash: matches[0].txHash,
    reason: null,
  };
};
