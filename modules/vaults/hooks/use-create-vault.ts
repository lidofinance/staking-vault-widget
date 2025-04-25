import { useCallback } from 'react';
import {
  useConfig,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { type Address, parseEventLogs, type PublicClient } from 'viem';
import { VaultFactoryAbi } from 'abi/vault-factory';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

import { VaultFactoryArgs } from 'types';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';
import { VAULTS_CONNECT_DEPOSIT } from '../consts';

interface UseCreateVaultProps {
  onMutate: () => void;
}

export const useCreateVault = ({
  onMutate = () => {},
}: UseCreateVaultProps) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const publicClient = usePublicClient();

  const { data: createVaultTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: createVaultReceipt } = useWaitForTransactionReceipt({
    hash: createVaultTx,
  });

  const callCreateVault = useCallback(
    async (args: VaultFactoryArgs) => {
      const vaultFactoryAddress = getContractAddress(chainId, 'vaultFactory');
      invariant(
        vaultFactoryAddress,
        '[useCreateVaultWihDashboard] vaultFactoryAddress is not defined',
      );
      invariant(
        publicClient,
        '[useCreateVaultWihDashboard] publicClient is not defined',
      );

      const tx = await writeContractAsync({
        abi: VaultFactoryAbi,
        address: vaultFactoryAddress,
        functionName: 'createVaultWithDashboard',
        value: VAULTS_CONNECT_DEPOSIT,
        args: [
          args.defaultAdmin,
          args.nodeOperator,
          args.nodeOperatorManager,
          args.nodeOperatorFeeBP,
          args.confirmExpiry,
          args.roles,
          '0x',
        ],
        chainId,
      });

      const receipt = await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      const logs = parseEventLogs({
        abi: VaultFactoryAbi,
        logs: receipt.logs,
      });

      const address = (logs[0].args as { vault: Address; owner: Address })
        .vault;
      return { address, tx };
    },
    [chainId, writeContractAsync, publicClient],
  );

  return {
    callCreateVault,
    createVaultTx,
    createVaultReceipt,
  };
};

export const simulateCreateVault = async (
  publicClient: PublicClient,
  account: Address | undefined,
  args: VaultFactoryArgs,
) => {
  invariant(
    publicClient.chain?.id,
    '[simulateCreateVault] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'vaultFactory');

  invariant(
    address,
    '[simulateCreateVault] vaultFactoryAddress is not defined',
  );

  return await publicClient.simulateContract({
    address: address,
    abi: VaultFactoryAbi,
    account,
    value: VAULTS_CONNECT_DEPOSIT,
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
  });
};
