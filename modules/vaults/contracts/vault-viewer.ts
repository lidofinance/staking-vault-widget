import { getContract, PublicClient } from 'viem';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';

// TODO: move to lido-sdk
export const getVaultViewerContract = (publicClient: PublicClient) => {
  invariant(
    publicClient.chain?.id,
    '[getVaultViewerContract] chainId is not defined',
  );

  const address = getContractAddress(publicClient.chain.id, 'vaultViewer');

  invariant(address, '[getVaultViewerContract] vaultViewer is not defined');

  return getContract({
    address,
    abi: VaultViewerAbi,
    client: { public: publicClient },
  });
};
