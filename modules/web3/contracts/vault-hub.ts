import { type Address, getContract, PublicClient } from 'viem';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VAULT_HUB_BY_NETWORK } from 'consts/vault-hub';
import { VaultHubAbi } from 'abi/vault-hub';

// TODO: move to lido-sdk
export const getVaultHubContract = (publicClient: PublicClient) => {
  return getContract({
    address: VAULT_HUB_BY_NETWORK[CHAINS.Sepolia] as Address,
    abi: VaultHubAbi,
    client: {
      public: publicClient,
    },
  });
};
