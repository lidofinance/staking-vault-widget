import { useCallback } from 'react';
import {
  useConfig,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';

export const useClaim = (onMutate = () => {}) => {
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
        abi: dashboardAbi,
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

export const useSimulationClaim = (recipient: Address) => {
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
