import { useReadContract, useChainId } from 'wagmi';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { getContractAddress } from 'config';

export const useVaultsConnectedBound = (from: number, to: number) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultViewerAbi,
    address: getContractAddress(chainId, 'vaultDataViewer'),
    functionName: 'vaultsConnectedBound',
    args: [BigInt(from), BigInt(to)],
  });
};
