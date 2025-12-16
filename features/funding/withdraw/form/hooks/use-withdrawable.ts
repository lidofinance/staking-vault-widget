import { useReadDashboard } from 'modules/vaults';

export const useWithdrawable = () => {
  return useReadDashboard({
    functionName: 'withdrawableValue',
    applyReport: true,
  });
};
