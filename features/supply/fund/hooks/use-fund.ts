import { useCallback } from 'react';
import {
  usePublicClient,
  useSimulateContract,
  useWriteContract,
  useAccount,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import { SubmitStep, SubmitStepEnum } from 'shared/transaction-modal/types';

export const useFund = (onMutate = () => {}) => {
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const { data: fundTx, writeContractAsync } = useWriteContract({
    mutation: {
      onMutate,
    },
  });

  const callVaultFund = useCallback(
    async (
      amount: bigint,
      setModalState: (submitStep: { step: SubmitStep; tx?: Address }) => void,
    ) => {
      invariant(
        activeVault?.owner,
        '[useFundWithDashboard] owner is undefined',
      );
      invariant(
        publicClient,
        '[useFundWithDashboard] publicClient is undefined',
      );

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault.owner,
        functionName: 'fund',
        value: amount,
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [writeContractAsync, activeVault?.owner, publicClient],
  );

  return {
    callVaultFund,
    fundTx,
  };
};

export type SimulationFundProps = {
  address: Address | undefined;
  amount: bigint;
};

export const useSimulationFund = ({ address, amount }: SimulationFundProps) => {
  const { address: accountAddress } = useAccount();
  const { hasPermission } = useVaultPermissions('funder');

  return useSimulateContract({
    abi: dashboardAbi,
    address,
    account: accountAddress,
    functionName: 'fund',
    value: amount,
    query: {
      enabled: !!address && hasPermission && !!amount,
    },
  });
};
