import { type Address, createPublicClient, getContract, http } from 'viem';
import { holesky } from 'viem/chains';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VAULT_HUB_BY_NETWORK } from 'consts/vault-hub';
import { VaultHubAbi } from 'abi/vault-hub';

// TODO: move to lido-sdk
export const getVaultHubContract = () => {
  return getContract({
    address: VAULT_HUB_BY_NETWORK[CHAINS.Holesky] as Address,
    abi: VaultHubAbi,
    client: {
      public: createPublicClient({
        chain: holesky,
        transport: http('https://1rpc.io/holesky'),
      }),
    },
  });
};
