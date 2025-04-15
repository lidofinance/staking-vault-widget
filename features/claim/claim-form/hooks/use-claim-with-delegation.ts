import { useCallback } from 'react';
import {
  useConfig,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { DelegationAbi } from 'abi/delegation';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';

export const useClaimWithDelegation = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;

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
    async (recipient: Address) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: owner as Address,
        functionName: 'claimNodeOperatorFee',
        args: [recipient],
        chainId,
      });
    },
    [chainId, writeContractAsync, owner],
  );

  return {
    callClaim,
    claimTx,
    claimReceipt,
  };
};

export const useSimulationClaimWithDelegation = (recipient: Address) => {
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const isEnabled = !!owner && !!recipient;

  return useSimulateContract({
    abi: DelegationAbi,
    address: owner,
    functionName: 'claimNodeOperatorFee',
    args: [recipient],
    query: {
      enabled: isEnabled,
    },
  });
};
