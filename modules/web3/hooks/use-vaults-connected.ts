import { useReadContract, useChainId } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { VAULT_VIEWER_BY_NETWORK } from 'consts/vault-viewer';

export const useVaultsConnected = () => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultViewerAbi,
    address: VAULT_VIEWER_BY_NETWORK[chainId as CHAINS],
    functionName: 'vaultsConnected',
    chainId,
  });
};
