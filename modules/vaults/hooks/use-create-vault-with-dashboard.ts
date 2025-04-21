import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { VaultFactoryAbi } from 'abi/vault-factory';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

import { VaultFactoryArgs } from 'types';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';

export interface CreateWithDelegationProps {
  onMutate: () => void;
}

export const useCreateVaultWihDashboard = ({
  onMutate = () => {},
}: CreateWithDelegationProps) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();

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

      return await writeContractAsync({
        abi: VaultFactoryAbi,
        address: vaultFactoryAddress,
        functionName: 'createVaultWithDashboard',
        args: [
          args.defaultAdmin,
          args.nodeOperator,
          args.nodeOperatorManager,
          args.nodeOperatorFeeBP,
          args.confirmExpiry,
          // TODO role assigment
          [],
          '0x',
        ],
        chainId,
      });
    },
    [chainId, writeContractAsync],
  );

  return {
    callCreateVault,
    createVaultTx,
    createVaultReceipt,
  };
};
