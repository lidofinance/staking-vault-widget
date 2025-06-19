import { encodeFunctionData, parseEventLogs } from 'viem';

import { VaultFactoryAbi } from 'abi/vault-factory';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_CONNECT_DEPOSIT,
} from 'modules/vaults';

import type { CreateVaultSchema } from '../types';
import type { TransactionResponse } from 'modules/web3';
import { createVaultSchema } from './validation';

export const schemaToTx = (unparsedValues: CreateVaultSchema) => {
  const values = createVaultSchema.parse(unparsedValues);
  const {
    confirmExpiry,
    nodeOperatorFeeBP,
    nodeOperator,
    nodeOperatorManager,
  } = values;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  const nodeOperatorFeeBPFormatted = BigInt(
    Math.floor((nodeOperatorFeeBP * VAULT_TOTAL_BASIS_POINTS) / 100),
  );

  // first manager goes to factory as direct argument
  const [defaultAdmin] = values.vaultManager;

  return {
    data: encodeFunctionData({
      abi: VaultFactoryAbi,
      functionName: 'createVaultWithDashboard',
      args: [
        defaultAdmin.value,
        nodeOperator,
        nodeOperatorManager,
        nodeOperatorFeeBPFormatted,
        confirmExpiryFormatted,
        [],
      ],
    }),
    value: VAULTS_CONNECT_DEPOSIT,
  };
};

export const parseVaultTx = ({ receipts }: TransactionResponse) => {
  if (!receipts || receipts.length === 0)
    return { vaultAddress: null, txHash: null };

  const receipt = receipts[receipts.length - 1];
  const txHash = receipt.transactionHash;

  const logs = parseEventLogs({
    abi: VaultFactoryAbi,
    logs: receipt.logs,
    strict: true,
    eventName: 'VaultCreated',
  });

  if (logs.length === 0) return { vaultAddress: null, txHash };

  return { vaultAddress: logs[0].args.vault, txHash };
};
