import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { DelegationAbi } from 'abi/delegation';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';

export const useClaimWithDelegation = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();

  const { data: claimTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: claimReceipt } = useWaitForTransactionReceipt({
    hash: claimTx,
  });

  const callClaim = useCallback(
    async (address: Address, recipient: Address) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: address,
        functionName: 'claimNodeOperatorFee',
        args: [recipient],
        chainId,
      });
    },
    [chainId, writeContractAsync],
  );

  return {
    callClaim,
    claimTx,
    claimReceipt,
  };
};
