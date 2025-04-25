import { useCallback } from 'react';
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import { SubmitStep, SubmitStepEnum } from 'shared/transaction-modal/types';

type WithdrawWithDashboardArgs = {
  recipient: Address;
  amount: bigint;
  setModalState: (submitStep: { step: SubmitStep; tx?: Address }) => void;
};

export const useWithdrawWithDashboard = (onMutate = () => {}) => {
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const { data: withdrawTx, writeContractAsync } = useWriteContract({
    mutation: {
      onMutate,
    },
  });

  const callWithdraw = useCallback(
    async ({ amount, recipient, setModalState }: WithdrawWithDashboardArgs) => {
      invariant(
        activeVault,
        '[useWithdrawWithDashboard] activeVault is undefined',
      );
      invariant(
        publicClient,
        '[useFundWithDashboard] publicClient is undefined',
      );

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault.owner,
        functionName: 'withdraw',
        args: [recipient, amount],
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [activeVault, writeContractAsync, publicClient],
  );

  return {
    callWithdraw,
    withdrawTx,
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
