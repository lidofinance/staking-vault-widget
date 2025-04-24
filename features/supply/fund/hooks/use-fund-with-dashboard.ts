import { useCallback } from 'react';
import { usePublicClient, useSimulateContract, useWriteContract } from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import { useDappStatus } from 'modules/web3';
import { SubmitStep, SubmitStepEnum } from '../types';

export const useFundWithDashboard = (onMutate = () => {}) => {
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
      invariant(publicClient, 'activeVault?.owner is undefined');

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

export type SimulationFundDashboardProps = {
  address: Address | undefined;
  amount: bigint;
};

export const useSimulationFundWithDashboard = ({
  address,
  amount,
}: SimulationFundDashboardProps) => {
  const { hasPermission } = useVaultPermissions('funder');
  const { address: account } = useDappStatus();

  return useSimulateContract({
    abi: dashboardAbi,
    address,
    account,
    functionName: 'fund',
    value: amount,
    query: {
      enabled: !!address && hasPermission && !!amount,
    },
  });
};
