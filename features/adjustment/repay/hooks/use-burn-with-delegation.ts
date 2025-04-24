import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';

export const useBurnWithDelegation = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();

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
    async ({ token, amount }: { token: string; amount: bigint }) => {
      return await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault?.owner as Address,
        functionName: token === 'stETH' ? 'burnStETH' : 'burnWstETH',
        args: [amount],
        chainId,
      });
    },
    [chainId, activeVault?.owner, writeContractAsync],
  );

  return {
    callBurn,
    burnTx,
    burnReceipt,
  };
};
