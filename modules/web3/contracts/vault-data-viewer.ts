import { Address, getContract, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultDataViewerAbi } from 'abi/vault-data-viewer';
import { VAULT_DATA_VIEWER_BY_NETWORK } from 'consts/vault-data-viewer';

// TODO: move to lido-sdk
export const getVaultDataViewerContract = (publicClient: PublicClient) => {
  return getContract({
    address: VAULT_DATA_VIEWER_BY_NETWORK[CHAINS.Sepolia] as Address,
    abi: VaultDataViewerAbi,
    client: { public: publicClient },
  });
};
