import { Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { getContractAddress } from 'config';

export const useVaultsByOwner = (address: Address | undefined) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultViewerAbi,
    address: getContractAddress(chainId, 'vaultViewer'),
    functionName: 'vaultsByOwner',
    args: [address as Address],
    query: {
      enabled: !!address,
    },
  });
};
