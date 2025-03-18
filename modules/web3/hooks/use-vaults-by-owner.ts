import { Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultDataViewerAbi } from 'abi/vault-data-viewer';
import { VAULT_DATA_VIEWER_BY_NETWORK } from 'consts/vault-data-viewer';

export const useVaultsByOwner = (address: Address) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultDataViewerAbi,
    address: VAULT_DATA_VIEWER_BY_NETWORK[chainId as CHAINS] as Address,
    functionName: 'vaultsByOwner',
    args: [address],
    chainId,
  });
};
