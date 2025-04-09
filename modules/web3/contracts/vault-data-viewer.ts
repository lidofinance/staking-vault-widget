import { Address, getContract, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { VAULT_VIEWER_BY_NETWORK } from 'consts/vault-viewer';

// TODO: move to lido-sdk
export const getVaultDataViewerContract = (publicClient: PublicClient) => {
  return getContract({
    address: VAULT_VIEWER_BY_NETWORK[CHAINS.Sepolia] as Address,
    abi: VaultViewerAbi,
    client: { public: publicClient },
  });
};
