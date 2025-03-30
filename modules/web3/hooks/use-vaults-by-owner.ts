import { Address } from 'viem';
import { useChainId, useReadContract } from 'wagmi';
import { CHAINS } from '@lidofinance/lido-ethereum-sdk';

import { VaultViewerAbi } from 'abi/vault-viewer';
import { VAULT_VIEWER_BY_NETWORK } from 'consts/vault-viewer';

export const useVaultsByOwner = (address: Address) => {
  const chainId = useChainId();

  return useReadContract({
    abi: VaultViewerAbi,
    address: VAULT_VIEWER_BY_NETWORK[chainId as CHAINS] as Address,
    functionName: 'vaultsByOwner',
    args: [address],
    chainId,
  });
};
