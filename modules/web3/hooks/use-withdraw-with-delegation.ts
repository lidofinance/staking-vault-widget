import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { DelegationAbi } from 'abi/delegation';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

export interface WithdrawWithDelegationProps {
  onMutate?: () => void;
}

export const useWithdrawWithDelegation = ({
  onMutate = () => {},
}: WithdrawWithDelegationProps) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();

  const { data: withdrawTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: withdrawReceipt } = useWaitForTransactionReceipt({
    hash: withdrawTx,
  });

  const callWithdraw = useCallback(
    async (
      address: Address,
      { amount, recipient }: { amount: number; recipient: Address },
    ) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: address,
        functionName: 'withdraw',
        args: [recipient, BigInt(amount)],
        chainId,
      });
    },
    [chainId, writeContractAsync],
  );

  return {
    callWithdraw,
    withdrawTx,
    withdrawReceipt,
  };
};
