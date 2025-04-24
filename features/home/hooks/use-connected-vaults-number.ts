import { usePublicClient, useReadContract } from 'wagmi';
import { getContractAddress } from 'config';
import { VaultHubAbi } from 'abi/vault-hub';

export const useConnectedVaultsNumber = () => {
  const publicClient = usePublicClient();
  const address = getContractAddress(publicClient?.chain.id, 'vaultHub');

  return useReadContract({
    address,
    abi: VaultHubAbi,
    functionName: 'vaultsCount',
    query: {
      enabled: !!address,
    },
  });
};
