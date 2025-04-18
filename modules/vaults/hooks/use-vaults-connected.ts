import { useReadContract, useChainId } from 'wagmi';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { getContractAddress } from 'config';

export const useVaultsConnected = () => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultViewerAbi,
    address: getContractAddress(chainId, 'vaultViewer'),
    functionName: 'vaultsConnected',
    chainId,
  });
};
