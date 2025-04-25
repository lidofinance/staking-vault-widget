import { useCallback } from 'react';
import { useEstimateGas, usePublicClient, useWriteContract } from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import {
  SubmitPayload,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';
import { fallbackedAddress } from 'utils/fallbacked-address';

type WithdrawArgs = {
  recipient: Address;
  amount: bigint;
  setModalState: (submitStep: SubmitPayload) => void;
};

export const useWithdraw = (onMutate = () => {}) => {
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const { data: withdrawTx, writeContractAsync } = useWriteContract({
    mutation: {
      onMutate,
    },
  });

  const callWithdraw = useCallback(
    async ({ amount, recipient, setModalState }: WithdrawArgs) => {
      invariant(activeVault, '[useWithdraw] activeVault is undefined');
      invariant(publicClient, '[useWithdraw] publicClient is undefined');

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

type EstimateGasWithdrawArgs = {
  recipient: Address;
  amount?: bigint;
};

export const useEstimateGasWithdraw = ({
  recipient,
  amount,
}: EstimateGasWithdrawArgs) => {
  const { activeVault } = useVaultInfo();

  const { address } = useDappStatus();
  const { hasPermission } = useVaultPermissions('withdrawer');
  const enabled = !!(hasPermission && address);
  const owner = activeVault?.owner;

  return useEstimateGas({
    to: owner,
    account: address,
    data: encodeFunctionData({
      abi: dashboardAbi,
      functionName: 'withdraw',
      args: [fallbackedAddress(recipient || address), amount || 1n],
    }),
    query: {
      enabled,
    },
  });
};
