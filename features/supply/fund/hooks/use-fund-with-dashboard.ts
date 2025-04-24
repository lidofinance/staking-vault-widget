import { useCallback } from 'react';
import {
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract,
  UseSimulateContractParameters,
  useAccount,
} from 'wagmi';
import { Address } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useVaultInfo } from 'features/overview/contexts';
import invariant from 'tiny-invariant';
import { useVaultPermissions } from 'modules/vaults/hooks/use-vault-permissions';

export const useFundWithDashboard = (onMutate = () => {}) => {
  const { activeVault } = useVaultInfo();

  const { data: fundTx, writeContractAsync } = useWriteContract({
    mutation: {
      onMutate,
    },
  });

  const { data: fundReceipt } = useWaitForTransactionReceipt({
    hash: fundTx,
  });

  const callVaultFund = useCallback(
    async (amount: bigint) => {
      invariant(activeVault?.owner, 'activeVault?.owner is undefined');
      return writeContractAsync({
        abi: dashboardAbi,
        address: activeVault.owner,
        functionName: 'fund',
        value: amount,
      });
    },
    [writeContractAsync, activeVault?.owner],
  );

  return {
    callVaultFund,
    fundTx,
    fundReceipt,
  };
};

export type SimulationFundWithDashboardProps = {
  address: Address | undefined;
  amount: bigint;
};

export const useSimulationFundWithDashboard = ({
  address,
  amount,
}: SimulationFundWithDashboardProps) => {
  const { address: accountAddress } = useAccount();
  const { hasPermission } = useVaultPermissions('funder');
  const simulationContractPayload: UseSimulateContractParameters = {
    abi: dashboardAbi,
    address,
    account: accountAddress,
    functionName: 'fund',
    value: amount,
    query: {
      enabled: !!address && hasPermission,
    },
  };

  return useSimulateContract(simulationContractPayload);
};
