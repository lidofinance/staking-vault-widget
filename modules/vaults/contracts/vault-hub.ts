import { getContract, PublicClient } from 'viem';

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
