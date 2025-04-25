import { usePublicClient, useReadContract } from 'wagmi';
import { getContractAddress } from 'config';
import { VaultHubAbi } from 'abi/vault-hub';

export const useConnectedVaultsNumber = () => {
  const publicClient = usePublicClient();
  const address = publicClient?.chain.id
    ? getContractAddress(publicClient.chain.id, 'vaultHub')
    : undefined;

  return useReadContract({
    address,
    abi: VaultHubAbi,
    functionName: 'vaultsCount',
    query: {
      enabled: !!address,
    },
  });
};
