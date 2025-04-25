import { useCallback } from 'react';
import { useConfig, usePublicClient, useWriteContract } from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import { SubmitStep, SubmitStepEnum } from 'shared/transaction-modal/types';
import invariant from 'tiny-invariant';

export const useBurnDashboard = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

  const { data: burnTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const callBurn = useCallback(
    async ({
      token,
      amount,
      setModalState,
    }: {
      token: string;
      amount: bigint;
      setModalState: (submitStep: { step: SubmitStep; tx?: Address }) => void;
    }) => {
      invariant(publicClient, '[useBurnDashboard] publicClient is undefined');

      setModalState({ step: SubmitStepEnum.confirming });
      const tx = await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault?.owner as Address,
        functionName: token === 'stETH' ? 'burnStETH' : 'burnWstETH',
        args: [amount],
        chainId,
      });

      setModalState({ step: SubmitStepEnum.submitting, tx });
      await publicClient.waitForTransactionReceipt({
        hash: tx,
      });

      return tx;
    },
    [chainId, activeVault?.owner, writeContractAsync, publicClient],
  );

  return {
    callBurn,
    burnTx,
  };
};
