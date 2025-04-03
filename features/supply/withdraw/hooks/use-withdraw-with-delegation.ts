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

export const useWithdrawWithDelegation = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
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
    async ({
      amount,
      recipient,
      token,
    }: {
      amount: number;
      recipient: Address;
      token: string;
    }) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: activeVault?.owner as Address,
        functionName: token === 'ETH' ? 'withdraw' : 'withdrawWETH',
        args: [recipient, BigInt(amount)],
        chainId,
      });
    },
    [chainId, writeContractAsync, activeVault?.owner],
  );

  return {
    callWithdraw,
    withdrawTx,
    withdrawReceipt,
  };
};

type SimulateWithDelegationArgs = {
  token: string;
  recipient: Address;
  amount?: number;
};

export const useSimulateWithDelegation = ({
  token,
  recipient,
  amount = 0,
}: SimulateWithDelegationArgs) => {
  const { activeVault } = useVaultInfo();
  const { chainId } = useDappStatus();
  const owner = activeVault?.owner;

  return useSimulateContract({
    abi: DelegationAbi,
    address: owner as Address,
    functionName: token === 'ETH' ? 'withdraw' : 'withdrawWETH',
    args: [recipient, BigInt(amount)],
    query: {
      enabled: !!owner && !!recipient,
    },
    chainId,
  });
};
