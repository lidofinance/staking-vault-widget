import { useVaultInfo } from 'modules/vaults';
import { useReadContract } from 'wagmi';
import { dashboardAbi } from 'abi/dashboard-abi';

// TODO: apply report optimistically
export const useWithdrawable = () => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

  return useReadContract({
    abi: dashboardAbi,
    address: owner,
    functionName: 'withdrawableValue',
    query: {
      enabled: !!owner,
    },
  });
};
