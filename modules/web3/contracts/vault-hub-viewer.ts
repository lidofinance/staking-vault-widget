import { Address, createPublicClient, getContract, http } from 'viem';
import { holesky } from 'viem/chains';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultHubViewerAbi } from 'abi/vault-hub-viewer';
import { VAULT_HUB_VIEWER_BY_NETWORK } from 'consts/vault-hub-viewer';

// TODO: move to lido-sdk
export const getVaultHubViewerContract = () => {
  return getContract({
    address: VAULT_HUB_VIEWER_BY_NETWORK[CHAINS.Holesky] as Address,
    abi: VaultHubViewerAbi,
    client: {
      public: createPublicClient({
        chain: holesky,
        transport: http('https://1rpc.io/holesky'),
      }),
    },
  });
};
