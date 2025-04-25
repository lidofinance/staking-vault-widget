import { useCallback } from 'react';
import {
  useConfig,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseSimulateContractParameters,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';

export const useMint = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();

  const { data: mintTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: mintReceipt } = useWaitForTransactionReceipt({
    hash: mintTx,
  });

  const callMint = useCallback(
    async (recipient: Address, amount: bigint, token: string) => {
      return await writeContractAsync({
        abi: dashboardAbi,
        address: activeVault?.owner as Address,
        functionName: token === 'stETH' ? 'mintStETH' : 'mintWstETH',
        args: [recipient, amount],
        chainId,
      });
    },
    [chainId, writeContractAsync, activeVault?.owner],
  );

  return {
    callMint,
    mintTx,
    mintReceipt,
  };
};

export interface SimulationMintProps {
  recipient: Address;
  token: string;
  amount: number;
}

export const useSimulationMint = ({
  recipient,
  token,
  amount,
}: SimulationMintProps) => {
  const payload = [recipient, BigInt(amount ?? 0)];
  const functionName = token === 'stETH' ? 'mintStETH' : 'mintWstETH';
  const { activeVault } = useVaultInfo();
  const owner = activeVault?.owner;
  const isEnabled = !!(recipient && owner);

  const simulationContractPayload: UseSimulateContractParameters = {
    abi: dashboardAbi,
    address: owner,
    functionName,
    args: payload,
    query: {
      enabled: isEnabled,
    },
  };

  return useSimulateContract(simulationContractPayload);
};
