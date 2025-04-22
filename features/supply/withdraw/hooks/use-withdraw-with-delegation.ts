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

type WithdrawWithDelegationArgs = {
  recipient: Address;
  amount: bigint;
};

export const useWithdrawWithDelegation = (onMutate = () => {}) => {
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();

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
    async ({ amount, recipient }: WithdrawWithDelegationArgs) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: activeVault?.owner as Address,
        functionName: 'withdraw',
        args: [recipient, amount],
      });
    },
    [writeContractAsync, activeVault?.owner],
  );

  return {
    callWithdraw,
    withdrawTx,
    withdrawReceipt,
  };
};

type SimulateWithDelegationArgs = {
  recipient: Address;
  amount?: bigint;
};

export const useSimulateWithDelegation = ({
  recipient,
  amount = 0n,
}: SimulateWithDelegationArgs) => {
  const { activeVault } = useVaultInfo();
  const { chainId } = useDappStatus();
  const owner = activeVault?.owner;

  return useSimulateContract({
    abi: DelegationAbi,
    address: owner as Address,
    functionName: 'withdraw',
    args: [recipient, amount],
    query: {
      enabled: !!owner && !!recipient,
    },
    chainId,
  });
};
