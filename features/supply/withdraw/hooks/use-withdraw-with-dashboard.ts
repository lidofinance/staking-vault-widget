import { useCallback } from 'react';
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';

type WithdrawWithDashboardArgs = {
  recipient: Address;
  amount: bigint;
};

export const useWithdrawWithDashboard = (onMutate = () => {}) => {
  const { activeVault } = useVaultInfo();

  const { data: withdrawTx, writeContractAsync } = useWriteContract({
    mutation: {
      onMutate,
    },
  });

  const { data: withdrawReceipt } = useWaitForTransactionReceipt({
    hash: withdrawTx,
  });

  const callWithdraw = useCallback(
    async ({ amount, recipient }: WithdrawWithDashboardArgs) => {
      invariant(activeVault, 'activeVault is undefined');
      return await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault.owner,
        functionName: 'withdraw',
        args: [recipient, amount],
      });
    },
    [activeVault, writeContractAsync],
  );

  return {
    callWithdraw,
    withdrawTx,
    withdrawReceipt,
  };
};

type SimulateWithdrawDashboardArgs = {
  recipient: Address;
  amount?: bigint;
};

export const useSimulateWithdrawDashboard = ({
  recipient,
  amount = 0n,
}: SimulateWithdrawDashboardArgs) => {
  const { activeVault } = useVaultInfo();
  const { chainId } = useDappStatus();
  const { hasPermission } = useVaultPermissions('withdrawer');
  const owner = activeVault?.owner;

  return useSimulateContract({
    abi: dashboardAbi,
    address: owner as Address,
    functionName: 'withdraw',
    args: [recipient, amount],
    query: {
      enabled: !!owner && !!recipient && hasPermission,
    },
    chainId,
  });
};
