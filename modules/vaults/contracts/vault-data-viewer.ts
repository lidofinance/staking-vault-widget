import { getContract, PublicClient } from 'viem';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';

// TODO: move to lido-sdk
export const getVaultDataViewerContract = (publicClient: PublicClient) => {
  invariant(
    publicClient.chain?.id,
    '[getVaultDataViewerContract] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'vaultDataViewer');

  invariant(
    address,
    '[getVaultDataViewerContract] vaultDataViewer is not defined',
  );

  return getContract({
    address,
    abi: VaultViewerAbi,
    client: { public: publicClient },
  });
};
