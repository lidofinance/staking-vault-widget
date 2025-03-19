import { useCallback } from 'react';
import {
  useConfig,
  // useConnections,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultFactoryAbi } from 'abi/vault-factory';
import { VAULT_FACTORY_BY_NETWORK } from 'consts/vault-factory';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
// import { useLidoSDK } from 'modules/web3/web3-provider';

import { VaultFactoryArgs } from 'types';

export const useCreateVaultWithDelegation = () => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  // const connections = useConnections({ config: wagmiConfig });

  const { writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    // mutation: {
    //   onError: (err) => {
    //     console.log('onError::err', err);
    //   },
    //   onSuccess: (data) => {
    //     console.log('onSuccess::data', data)
    //   },
    //   onMutate: (data) => {
    //     console.log('onMutate::data', data)
    //   },
    // }
  });

  // const { core } = useLidoSDK();
  // const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
  //   hash,
  // })

  return useCallback(
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
};
