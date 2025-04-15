import { type Address, getContract, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VAULT_FACTORY_BY_NETWORK } from 'consts/vault-factory';
import { VaultFactoryAbi } from 'abi/vault-factory';

import { VaultFactoryArgs } from 'types';

// TODO: move to lido-sdk
export const getVaultFactoryContract = (publicClient: PublicClient) => {
  return getContract({
    address: VAULT_FACTORY_BY_NETWORK[CHAINS.Sepolia] as Address,
    abi: VaultFactoryAbi,
    client: {
      public: publicClient,
    },
  });
};

export const simulateCreateVault = async (
  publicClient: PublicClient,
  account: Address | undefined,
  args: VaultFactoryArgs,
) => {
  return await publicClient.simulateContract({
    address: VAULT_FACTORY_BY_NETWORK[CHAINS.Sepolia] as Address,
    abi: VaultFactoryAbi,
    functionName: 'createVaultWithDelegation',
    args: [args, '0x'],
    account,
  });
};
