import { useReadContract, useChainId } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { VAULT_VIEWER_BY_NETWORK } from 'consts/vault-viewer';

export const useVaultsConnectedBound = (from: number, to: number) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultViewerAbi,
    address: VAULT_VIEWER_BY_NETWORK[chainId as CHAINS],
    functionName: 'vaultsConnectedBound',
    args: [BigInt(from), BigInt(to)],
    chainId,
  });
};
