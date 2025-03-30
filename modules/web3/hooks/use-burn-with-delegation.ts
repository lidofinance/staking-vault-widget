import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { DelegationAbi } from 'abi/delegation';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

export const useBurnWithDelegation = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();

  const { data: burnTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: burnReceipt } = useWaitForTransactionReceipt({
    hash: burnTx,
  });

  const callBurn = useCallback(
    async (
      address: Address,
      { token, amount }: { token: string; amount: number },
    ) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: address,
        functionName: token === 'steth' ? 'burnStETH' : 'burnWstETH',
        args: [BigInt(amount)],
        chainId,
      });
    },
    [chainId, writeContractAsync],
  );

  return {
    callBurn,
    burnTx,
    burnReceipt,
  };
};
