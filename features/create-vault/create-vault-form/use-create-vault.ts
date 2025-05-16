import { useCallback, useMemo } from 'react';
import invariant from 'tiny-invariant';
import { encodeFunctionData } from 'viem';
import { useEstimateGas } from 'wagmi';
import { useFormContext, useFormState } from 'react-hook-form';

import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
  useDappStatus,
} from 'modules/web3';
import { ESTIMATE_ACCOUNT } from 'config/groups/web3';
import { getContractAddress } from 'config';

import { VaultFactoryAbi } from 'abi/vault-factory';
import {
  VAULT_TOTAL_BASIS_POINTS,
  VAULTS_CONNECT_DEPOSIT,
  VAULTS_OWNER_ROLES_MAP,
} from 'modules/vaults/consts';

import { ModalCTA } from './modal-cta';
import { CreateVaultSchema } from '../types';

const schemaToTx = (values: CreateVaultSchema) => {
  const {
    confirmExpiry,
    nodeOperatorFeeBP,
    nodeOperator,
    nodeOperatorManager,
  } = values;
  const confirmExpiryFormatted = BigInt(confirmExpiry * 60 * 60);
  const nodeOperatorFeeBPFormatted = BigInt(
    (nodeOperatorFeeBP * VAULT_TOTAL_BASIS_POINTS) / 100,
  );

  // first manager goes to factory as direct argument
  const [defaultAdmin] = values.vaultManager;

  // For now we populate all VaultManagers to all their roles
  // will be changed for next contract version
  const roles = Object.values(VAULTS_OWNER_ROLES_MAP).flatMap((role) => {
    return values.vaultManager.map((admin) => ({
      role,
      account: admin.value,
    }));
  });

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
        roles,
        '0x',
      ],
    }),
    value: VAULTS_CONNECT_DEPOSIT,
  };
};

export const useCreateVault = () => {
  const { chainId } = useDappStatus();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    createVault: useCallback(
      async (values: CreateVaultSchema) => {
        const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
        invariant(
          vaultFactoryAddress,
          '[useCreateVaultWihDashboard] vaultFactoryAddress is not defined',
        );

        const { data, value } = schemaToTx(values);

        const tx: TransactionEntry = {
          to: vaultFactoryAddress,
          loadingActionText: 'Creating vault',
          data,
          value,
        };

        const result = await withSuccess(
          sendTX({
            transactions: [tx],
            mainActionCompleteText: 'Vault created',
            mainActionLoadingText: 'Creating vault',
            renderSuccessContent: ModalCTA,
          }),
        );

        return result;
      },
      [chainId, sendTX],
    ),
    ...rest,
  };
};

export const useEstimateGasCreateVault = () => {
  const { chainId } = useDappStatus();
  const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
  const { getValues } = useFormContext<CreateVaultSchema>();
  const { isValid } = useFormState();

  const txData = useMemo(
    () => (isValid ? schemaToTx(getValues()) : null),
    [getValues, isValid],
  );

  return useEstimateGas({
    to: vaultFactoryAddress,
    data: txData?.data,
    account: ESTIMATE_ACCOUNT,
    value: txData?.value,
    query: {
      enabled: !!txData,
    },
  });
};
