import { useVaultInfo } from 'modules/vaults';
import { useReadContract } from 'wagmi';
import { dashboardAbi } from 'abi/dashboard-abi';

export const useWithdrawable = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  return useReadContract({
    abi: dashboardAbi,
    address: owner,
    functionName: 'withdrawableEther',
    query: {
      enabled: !!owner,
    },
  });
};
