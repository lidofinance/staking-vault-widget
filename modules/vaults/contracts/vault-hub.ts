import { getContract, PublicClient, WalletClient } from 'viem';

import { VaultHubAbi } from 'abi/vault-hub';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';

// TODO: move to lido-sdk
export const getVaultHubContract = <TClient extends PublicClient>(
  publicClient: TClient,
) => {
  invariant(
    publicClient.chain?.id,
    '[getVaultHubContract] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'vaultHub');

  invariant(address, '[getVaultHubContract] vaultHub is not defined');
  return getContract({
    address,
    abi: VaultHubAbi,
    client: {
      public: publicClient,
    },
  });
};

export const getWritableVaultHubContract = <
  TClient extends PublicClient,
  TWallet extends WalletClient,
>(
  publicClient: TClient,
  walletClient: TWallet,
) => {
  invariant(
    publicClient.chain?.id,
    '[getVaultHubContract] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'vaultHub');

  invariant(address, '[getVaultHubContract] vaultHub is not defined');
  return getContract({
    address,
    abi: VaultHubAbi,
    client: {
      public: publicClient,
      wallet: walletClient,
    },
  });
};
