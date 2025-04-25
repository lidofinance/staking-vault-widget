import { useCallback } from 'react';
import {
  usePublicClient,
  useWriteContract,
  useAccount,
  useEstimateGas,
} from 'wagmi';
import { Address, encodeFunctionData } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';
import {
  SubmitPayload,
  SubmitStepEnum,
} from 'shared/components/submit-modal/types';

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
      setModalState: (submitStep: SubmitPayload) => void,
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

export const useEstimateGasFund = ({
  address,
  amount,
}: SimulationFundProps) => {
  const { address: accountAddress } = useAccount();
  const { hasPermission } = useVaultPermissions('supplier');

  return useEstimateGas({
    to: address as Address,
    data: encodeFunctionData({
      abi: dashboardAbi,
      functionName: 'fund',
    }),
    account: accountAddress,
    value: amount,
    query: {
      enabled: !!address && hasPermission && !!amount,
    },
  });
};
