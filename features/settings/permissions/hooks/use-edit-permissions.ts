import { useCallback } from 'react';
import { useConfig, useWriteContract } from 'wagmi';
import { Address, PublicClient } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'features/overview/contexts';
import { GrantRole } from 'features/settings/permissions/types';

export const useEditPermissionsWithDashboard = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();

  const {
    data: grantPermissionsTx,
    writeContractAsync: writeGrantContractAsync,
  } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const {
    data: revokePermissionsTx,
    writeContractAsync: writeRevokeContractAsync,
  } = useWriteContract({
    config: wagmiConfig,
    mutation: {
      onMutate,
    },
  });

  const callEditPermissions = useCallback(
    async ({
      toRevoke,
      toGrant,
    }: {
      toRevoke: GrantRole[];
      toGrant: GrantRole[];
    }) => {
      const payload = [];
      if (toRevoke.length > 0) {
        payload.push(
          writeRevokeContractAsync({
            abi: dashboardAbi,
            address: activeVault?.owner as Address,
            functionName: 'revokeRoles',
            args: [toRevoke],
            chainId,
          }),
        );
      }

      if (toGrant.length > 0) {
        payload.push(
          writeGrantContractAsync({
            abi: dashboardAbi,
            address: activeVault?.owner as Address,
            functionName: 'grantRoles',
            args: [toGrant],
            chainId,
          }),
        );
      }

      return await Promise.all(payload);
    },
    [
      chainId,
      writeGrantContractAsync,
      activeVault?.owner,
      writeRevokeContractAsync,
    ],
  );

  return {
    callEditPermissions,
    grantPermissionsTx,
    revokePermissionsTx,
  };
};

type SimulateEditPermissions = {
  publicClient: PublicClient;
  delegationAddress: Address;
  account: Address;
  payload: { toRevoke: GrantRole[]; toGrant: GrantRole[] };
};

export const simulateEditPermissionsWithDashboard = async ({
  publicClient,
  delegationAddress,
  account,
  payload,
}: SimulateEditPermissions) => {
  const { toRevoke, toGrant } = payload;
  const simulationList = [];

  if (toRevoke.length > 0) {
    simulationList.push(
      publicClient.simulateContract({
        address: delegationAddress,
        abi: dashboardAbi,
        functionName: 'revokeRoles',
        args: [toRevoke],
        account,
      }),
    );
  }

  if (toGrant.length > 0) {
    simulationList.push(
      publicClient.simulateContract({
        address: delegationAddress,
        abi: dashboardAbi,
        functionName: 'grantRoles',
        args: [toGrant],
        account,
      }),
    );
  }

  return await Promise.all(simulationList);
};
