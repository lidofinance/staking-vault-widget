import { getContract, PublicClient } from 'viem';
import { VaultFactoryAbi } from 'abi/vault-factory';

import invariant from 'tiny-invariant';
import { getContractAddress } from 'config';

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
