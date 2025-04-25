import { useCallback } from 'react';
import {
  useConfig,
  useSimulateContract,
  usePublicClient,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { SubmitStep, SubmitStepEnum } from 'shared/transaction-modal/types';

export const useClaimDashboard = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();
  const owner = activeVault?.owner;

  const { data: claimTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const callClaim = useCallback(
    async (
      recipient: Address,
      setModalState: (submitStep: { step: SubmitStep; tx?: Address }) => void,
    ) => {
      invariant(owner, '[useClaimDashboard] owner is not available');
      invariant(
        publicClient,
        '[useClaimDashboard] publicClient is not available',
      );

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: owner,
        functionName: 'claimNodeOperatorFee',
        args: [recipient],
        chainId,
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [chainId, writeContractAsync, owner, publicClient],
  );

  return {
    callClaim,
    claimTx,
  };
};

export const useSimulationClaimDashboard = (recipient: Address) => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const isEnabled = !!owner && !!recipient;

  return useSimulateContract({
    abi: dashboardAbi,
    address: owner,
    functionName: 'claimNodeOperatorFee',
    args: [recipient],
    query: {
      enabled: isEnabled,
    },
  });
};
