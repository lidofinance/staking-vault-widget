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
import { useVaultInfo } from 'features/overview/contexts';

export const useFundWithDelegation = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();

  const { data: fundTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: fundReceipt } = useWaitForTransactionReceipt({
    hash: fundTx,
  });

  const callVaultFund = useCallback(
    async (token: string, amount: bigint) => {
      const functionName = token === 'ETH' ? 'fund' : 'fundWeth';
      const isFund = functionName === 'fund';
      const owner = activeVault?.owner;

      const contractPayload = {
        abi: DelegationAbi,
        address: owner,
        functionName,
        query: {
          enabled: owner,
        },
        chainId,
      };

      if (isFund) {
        // @ts-expect-error ts-types
        contractPayload.value = amount;
      } else {
        // @ts-expect-error ts-types
        contractPayload.args = [amount];
      }
      // @ts-expect-error ts-types
      return await writeContractAsync(contractPayload);
    },
    [chainId, writeContractAsync, activeVault?.owner],
  );

  return {
    callVaultFund,
    fundTx,
    fundReceipt,
  };
};

export interface SimulationFundWithDelegationProps {
  address: Address | undefined;
  token: string;
  amount: bigint;
}

export const useSimulationFundWithDelegation = ({
  address,
  token,
  amount,
}: SimulationFundWithDelegationProps) => {
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
    simulationContractPayload.value = amount;
  } else {
    simulationContractPayload.args = [amount];
  }

  return useSimulateContract(simulationContractPayload);
};
