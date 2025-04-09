import { useVaultInfo } from 'features/overview/contexts';
import { useReadContract } from 'wagmi';
import { DelegationAbi } from 'abi/delegation';

export const useWithdrawable = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  return useReadContract({
    abi: DelegationAbi,
    address: owner,
    functionName: 'withdrawableEther',
    query: {
      enabled: !!owner,
    },
  });
};
