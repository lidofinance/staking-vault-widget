import { type Address, getContract, PublicClient } from 'viem';
import { VaultFactoryAbi } from 'abi/vault-factory';

import { VaultFactoryArgs } from 'types';
import invariant from 'tiny-invariant';
import { getContractAddress } from 'config';
import { VAULTS_CONNECT_DEPOSIT } from '../consts';

// TODO: move to lido-sdk
export const getVaultFactoryContract = (publicClient: PublicClient) => {
  invariant(publicClient.chain?.id, '[VaultFactory] chainId is not defined');

  const address = getContractAddress(publicClient.chain.id, 'vaultFactory');

  invariant(
    address,
    '[getVaultFactoryContract] vaultFactoryAddress is not defined',
  );
  return getContract({
    address,
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
    account,
  });
};
