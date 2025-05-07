import { useCallback } from 'react';
import { encodeFunctionData } from 'viem';
import { VaultFactoryAbi } from 'abi/vault-factory';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

import { VaultFactoryArgs } from 'types';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';
import { VAULTS_CONNECT_DEPOSIT } from '../../../modules/vaults/consts';
import {
  TransactionEntry,
  useSendTransaction,
  withSuccess,
} from 'modules/web3';
import { ModalCTA } from '../create-vault-form/modal-cta';

export const useCreateVault = () => {
  const { chainId } = useDappStatus();
  const { sendTX, ...rest } = useSendTransaction();

  return {
    createVault: useCallback(
      async (args: VaultFactoryArgs) => {
        const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
        invariant(
          vaultFactoryAddress,
          '[useCreateVaultWihDashboard] vaultFactoryAddress is not defined',
        );

        const tx: TransactionEntry = {
          to: vaultFactoryAddress,
          loadingActionText: 'Creating vault',
          data: encodeFunctionData({
            abi: VaultFactoryAbi,
            functionName: 'createVaultWithDashboard',
            args: [
              args.defaultAdmin,
              args.nodeOperator,
              args.nodeOperatorManager,
              args.nodeOperatorFeeBP,
              args.confirmExpiry,
              args.roles,
              '0x',
            ],
          }),

          value: VAULTS_CONNECT_DEPOSIT,
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
