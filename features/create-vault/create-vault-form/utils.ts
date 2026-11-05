import {
  encodeFunctionData,
  isAddress,
  isAddressEqual,
  parseEventLogs,
} from 'viem';
import type { Address, Hash, Hex, Log } from 'viem';

import { VaultFactoryAbi } from '@lidofinance/lido-ethereum-sdk/stvault';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_CONNECT_DEPOSIT,
  VAULTS_ROOT_ROLES_MAP,
} from 'modules/vaults';

import type { CreateVaultSchema } from '../types';
import type { TransactionResponse } from 'modules/web3';
import { createVaultSchema } from './validation';

export const schemaToTx = (unparsedValues: CreateVaultSchema) => {
  const values = createVaultSchema.parse(unparsedValues);
  const { confirmExpiry, feeRate, nodeOperatorManager, nodeOperator } = values;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  const nodeOperatorFeeRateFormatted = BigInt(
    Math.floor((feeRate * VAULT_TOTAL_BASIS_POINTS) / 100),
  );

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
};

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

export const parseVaultTx = (
  { receipts, isAA, callStatus }: TransactionResponse,
  { factory, defaultAdmin }: VaultTxExpected,
): ParsedVaultTx => {
  // in AA, confirmations may fail after the wallet reported success:
  // then the wallet receipts are the only source of the created vault
  const sourceReceipts: readonly VaultTxReceipt[] =
    receipts && receipts.length > 0
      ? receipts
      : isAA
        ? callStatus.receipts ?? []
        : [];

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
          // wallet logs are not validated, and isAddressEqual throws on a malformed address
          isAddress(log.address, { strict: false }) &&
          isAddressEqual(log.address, factory),
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
