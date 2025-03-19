import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultFactoryAbi } from 'abi/vault-factory';
import { VAULT_FACTORY_BY_NETWORK } from 'consts/vault-factory';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

import { VaultFactoryArgs } from 'types';

export interface CreateWithDelegationProps {
  onMutate: () => void;
}

export const useCreateVaultWithDelegation = ({
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
      return await writeContractAsync({
        abi: VaultFactoryAbi,
        address: VAULT_FACTORY_BY_NETWORK[chainId as CHAINS] as Address,
        functionName: 'createVaultWithDelegation',
        args: [args, '0x'],
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
