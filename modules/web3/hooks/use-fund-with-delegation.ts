import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { DelegationAbi } from 'abi/delegation';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

export interface FundWithDelegationProps {
  onMutate?: () => void;
}

export const useFundWithDelegation = ({
  onMutate = () => {},
}: FundWithDelegationProps) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();

  const { data: fundTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: fundReceipt } = useWaitForTransactionReceipt({
    hash: fundTx,
  });

  const callFund = useCallback(
    async (address: Address, amount: number) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: address,
        functionName: 'fund',
        value: BigInt(amount),
        chainId,
      });
    },
    [chainId, writeContractAsync],
  );

  return {
    callFund,
    fundTx,
    fundReceipt,
  };
};
