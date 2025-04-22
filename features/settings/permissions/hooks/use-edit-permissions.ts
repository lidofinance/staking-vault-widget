import { useCallback } from 'react';
import {
  useConfig,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import { Address, PublicClient } from 'viem';

import { DelegationAbi } from 'abi/delegation';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import { GrantRole } from 'features/settings/permissions/types';

export const useEditPermissionsWithDashboard = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();

  const { data: editPermissionsTx, writeContractAsync } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const { data: editPermissionsReceipt } = useWaitForTransactionReceipt({
    hash: editPermissionsTx,
  });

  const callEditPermissions = useCallback(
    async (permissions: GrantRole[]) => {
      return await writeContractAsync({
        abi: DelegationAbi,
        address: activeVault?.owner as Address,
        functionName: 'grantRoles',
        args: [permissions],
        chainId,
      });
    },
    [chainId, writeContractAsync, activeVault?.owner],
  );

  return {
    callEditPermissions,
    editPermissionsTx,
    editPermissionsReceipt,
  };
};

type SimulateEditPermissions = {
  publicClient: PublicClient;
  delegationAddress: Address;
  account: Address;
  permissions: GrantRole[];
};

export const simulateEditPermissionsWithDashboard = async ({
  publicClient,
  delegationAddress,
  account,
  permissions,
}: SimulateEditPermissions) => {
  return await publicClient.simulateContract({
    address: delegationAddress,
    abi: DelegationAbi,
    functionName: 'grantRoles',
    args: [permissions],
    account,
  });
};
