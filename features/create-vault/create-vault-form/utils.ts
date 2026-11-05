import { encodeFunctionData } from 'viem';

import { VaultFactoryAbi } from '@lidofinance/lido-ethereum-sdk/stvault';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_CONNECT_DEPOSIT,
  VAULTS_ROOT_ROLES_MAP,
} from 'modules/vaults';

import { getContractAddress } from 'config';
import type { TransactionResponse } from 'modules/web3';

import type { CreateVaultSchema } from '../types';
import { createVaultSchema } from './validation';
import { parseVaultTx } from './parse-vault-tx';

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
  };
};

export const parseCreateVaultTx = (result: TransactionResponse) =>
  parseVaultTx(result, (chainId) =>
    getContractAddress(chainId, 'vaultFactory'),
  );
