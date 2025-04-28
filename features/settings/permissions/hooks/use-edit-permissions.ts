import { MutableRefObject, useCallback } from 'react';
import { useConfig, usePublicClient, useWriteContract } from 'wagmi';
import { Address, Hash, PublicClient } from 'viem';

import { dashboardAbi } from 'abi/dashboard-abi';
import { useDappStatus } from 'modules/web3/hooks/use-dapp-status';
import { useVaultInfo } from 'modules/vaults';
import { GrantRole } from 'features/settings/permissions/types';
import { SubmitPayload, SubmitStepEnum } from 'shared/components/submit-modal';
import invariant from 'tiny-invariant';

export const useEditPermissionsWithDashboard = (onMutate = () => {}) => {
  const { chainId } = useDappStatus();
  const wagmiConfig = useConfig();
  const { activeVault } = useVaultInfo();
  const publicClient = usePublicClient();

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
    async (
      { toRevoke, toGrant }: { toRevoke: GrantRole[]; toGrant: GrantRole[] },
      setModalState: (submitStep: SubmitPayload) => void,
      abortControllerRef: MutableRefObject<AbortController>,
    ) => {
      invariant(
        publicClient,
        '[useEditPermissionsWithDashboard] publicClient is not defined',
      );
      invariant(
        activeVault?.owner,
        '[useEditPermissionsWithDashboard] owner is not defined',
      );

      const payload: {
        functionName: 'revokeRoles' | 'grantRoles';
        args: [GrantRole[]];
      }[] = [];
      if (toRevoke.length > 0) {
        payload.push({
          functionName: 'revokeRoles',
          args: [toRevoke],
        });
      }

      if (toGrant.length > 0) {
        payload.push({
          functionName: 'grantRoles',
          args: [toGrant],
        });
      }

      const responses: Hash[] = [];
      for (const { functionName, args } of payload) {
        const {
          current: { signal },
        } = abortControllerRef;
        if (signal.aborted) {
          return responses;
        }

        setModalState({ step: SubmitStepEnum.confirming });
        const callFunction =
          functionName === 'grantRoles'
            ? writeGrantContractAsync
            : writeRevokeContractAsync;
        const tx = await callFunction({
          abi: dashboardAbi,
          address: activeVault.owner,
          functionName,
          args,
          chainId,
        });

        setModalState({ step: SubmitStepEnum.submitting });
        await publicClient.waitForTransactionReceipt({
          hash: tx,
        });

        responses.push(tx);
      }

      return responses;
    },
    [
      chainId,
      writeGrantContractAsync,
      activeVault?.owner,
      writeRevokeContractAsync,
      publicClient,
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
