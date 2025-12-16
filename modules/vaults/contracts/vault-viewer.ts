import { getContract } from 'viem';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { getContractAddress } from 'config';
import invariant from 'tiny-invariant';

import type { RegisteredPublicClient } from 'modules/web3';

// TODO: move to lido-sdk
export const getVaultViewerContract = (
  publicClient: RegisteredPublicClient,
) => {
  const address = getContractAddress(publicClient.chain.id, 'vaultViewer');

  invariant(address, '[getVaultViewerContract] vaultViewer is not defined');

  return getContract({
    address,
    abi: VaultViewerAbi,
    client: { public: publicClient },
  });
};
