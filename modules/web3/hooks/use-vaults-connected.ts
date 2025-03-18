import { useReadContract, useChainId } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultDataViewerAbi } from 'abi/vault-data-viewer';
import { VAULT_DATA_VIEWER_BY_NETWORK } from 'consts/vault-data-viewer';

export const useVaultsConnected = () => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultDataViewerAbi,
    address: VAULT_DATA_VIEWER_BY_NETWORK[chainId as CHAINS],
    functionName: 'vaultsConnected',
    chainId,
  });
};
