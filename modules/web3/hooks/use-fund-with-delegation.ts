import { useCallback } from 'react';
import {
  useConfig,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseSimulateContractParameters,
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

  const callFundWeth = useCallback(
    async (address: Address, amount: number) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: address,
        functionName: 'fundWeth',
        args: [BigInt(amount)],
        chainId,
      });
    },
    [chainId, writeContractAsync],
  );

  return {
    callFund,
    callFundWeth,
    fundTx,
    fundReceipt,
  };
};

export interface SimulationFundWithDelegationProps {
  address: Address | undefined;
  token: string;
  amount: number;
}

export const useSimulationFundWithDelegation = ({
  address,
  token,
  amount,
}: SimulationFundWithDelegationProps) => {
  const payload = BigInt(amount);
  const functionName = token === 'ETH' ? 'fund' : 'fundWeth';
  const isFund = functionName === 'fund';

  const simulationContractPayload: UseSimulateContractParameters = {
    abi: DelegationAbi,
    address,
    functionName,
    query: {
      enabled: !!address,
    },
  };

  if (isFund) {
    simulationContractPayload.value = payload;
  } else {
    simulationContractPayload.args = [payload];
  }

  return useSimulateContract(simulationContractPayload);
};
