import { Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultHubViewerAbi } from 'abi/vault-hub-viewer';
import { VAULT_HUB_VIEWER_BY_NETWORK } from 'consts/vault-hub-viewer';

export const useVaultsByOwner = (address: Address) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultHubViewerAbi,
    address: VAULT_HUB_VIEWER_BY_NETWORK[chainId as CHAINS] as Address,
    functionName: 'vaultsByOwner',
    args: [address],
    chainId,
  });
};
