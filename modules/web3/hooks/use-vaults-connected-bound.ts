import { useReadContract, useChainId } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultHubViewerAbi } from 'abi/vault-hub-viewer';
import { VAULT_HUB_VIEWER_BY_NETWORK } from 'consts/vault-hub-viewer';

export const useVaultsConnectedBound = (from: number, to: number) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultHubViewerAbi,
    address: VAULT_HUB_VIEWER_BY_NETWORK[chainId as CHAINS],
    functionName: 'vaultsConnectedBound',
    args: [BigInt(from), BigInt(to)],
    chainId,
  });
};
