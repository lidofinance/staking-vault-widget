import { useMemo } from 'react';
import invariant from 'tiny-invariant';
import { isAddressEqual } from 'viem';
import { useQuery } from '@tanstack/react-query';

import { useVault } from 'modules/vaults';

import {
  DISCONNECT_STATUS,
  DISCONNECT_STEP,
  DISCONNECT_STEPS_ORDER,
} from '../const';

import type {
  DisconnectStatus,
  DisconnectStep,
  DisconnectStepState,
  DisconnectStepsState,
} from '../types';

// the furthest reached step wins, so a stale check on an earlier step can never
// drag the flow backwards
const getActiveStep = (
  checks: Record<DisconnectStep, boolean>,
): DisconnectStep | null => {
  for (let index = DISCONNECT_STEPS_ORDER.length - 1; index >= 0; index--) {
    const step = DISCONNECT_STEPS_ORDER[index];
    if (checks[step]) return step;
  }

  return null;
};

const getStepState = (
  step: DisconnectStep,
  activeStep: DisconnectStep | null,
): DisconnectStepState => {
  const isCurrent =
    step === activeStep ||
    // the last step only explains how the fees are recovered later on, it is
    // unlocked together with the withdraw step
    (step === DISCONNECT_STEP.RECOVER_FEES &&
      activeStep === DISCONNECT_STEP.WITHDRAW);
  const isPassed = activeStep !== null && step < activeStep;

  return {
    number: step,
    status: isPassed ? 'success' : 'pending',
    isAllowExpand: isCurrent,
    defaultExpanded: isCurrent,
  };
};

const getStatus = (
  activeStep: DisconnectStep | null,
  availableBalance: bigint,
): DisconnectStatus => {
  if (activeStep === null || activeStep === DISCONNECT_STEP.INITIATE_DISCONNECT)
    return DISCONNECT_STATUS.NOT_INITIATED;

  // the flow is over once there is nothing left to withdraw from the vault
  if (activeStep === DISCONNECT_STEP.WITHDRAW && availableBalance === 0n)
    return DISCONNECT_STATUS.COMPLETED;

  return DISCONNECT_STATUS.ONGOING;
};

const buildStepsState = (
  activeStep: DisconnectStep | null,
  availableBalance: bigint,
): DisconnectStepsState => ({
  activeStep,
  availableBalance,
  status: getStatus(activeStep, availableBalance),
  steps: DISCONNECT_STEPS_ORDER.reduce(
    (steps, step) => {
      steps[step] = getStepState(step, activeStep);
      return steps;
    },
    {} as Record<DisconnectStep, DisconnectStepState>,
  ),
});

/**
 * Single source of truth for the disconnect flow: resolves the step the user has
 * reached from the vault state, derives the `Step` props for each step of the
 * stepper and the overall status of the disconnection.
 *
 * All the consumers share this query, so the state is computed once per vault
 * state (the query key carries the block number of the base vault data).
 */
export const useDisconnectSteps = () => {
  const { activeVault, queryKeys } = useVault();

  return useQuery<DisconnectStepsState>({
    queryKey: [...queryKeys.state, 'disconnect-steps'] as const,
    enabled: !!activeVault,
    queryFn: async () => {
      invariant(activeVault, '[useDisconnectSteps] activeVault is not defined');

      const {
        vault,
        vaultOwner,
        pendingOwner,
        hasPendingOwner,
        isVaultConnected,
        isPendingDisconnect,
        isVaultDisconnected,
        dashboard,
        blockNumber,
      } = activeVault;

      // the vault contract stays readable after the disconnection, unlike the
      // Dashboard/VaultHub reads
      const availableBalance = await vault.read.availableBalance({
        blockNumber,
      });

      const dashboardAddress = dashboard.address;

      // the hub connection is wiped once the disconnect report is applied, from
      // that point on the ownership state is what moves the flow forward
      const isDisconnectedFromHub = !isVaultConnected;

      // `dashboard` is resolved from the vault owner as soon as the hub
      // connection is gone, so `isVaultDisconnected` (owner has no Dashboard
      // code) is what really tells us whether the Dashboard is still the owner
      const isOwnedByDashboard =
        !isVaultDisconnected && isAddressEqual(vaultOwner, dashboardAddress);

      const stepChecks: Record<DisconnectStep, boolean> = {
        // the vault is still connected: request the voluntary disconnect
        [DISCONNECT_STEP.INITIATE_DISCONNECT]:
          isVaultConnected && !isPendingDisconnect,
        // disconnect is requested: wait for the next report and apply it
        [DISCONNECT_STEP.APPLY_REPORT]: isPendingDisconnect,
        // disconnected, the Dashboard still owns the vault: abandon it
        [DISCONNECT_STEP.ABANDON_DASHBOARD]:
          isDisconnectedFromHub && !hasPendingOwner && isOwnedByDashboard,
        // ownership transfer is initiated: the new owner has to accept it
        [DISCONNECT_STEP.ACCEPT_OWNERSHIP]:
          isDisconnectedFromHub &&
          hasPendingOwner &&
          isOwnedByDashboard &&
          !isAddressEqual(pendingOwner, dashboardAddress),
        // ownership is accepted, the vault is owned directly: withdraw the ETH.
        // the step stays reachable with an empty balance as well, an empty
        // balance is what marks the whole flow as completed
        [DISCONNECT_STEP.WITHDRAW]:
          isDisconnectedFromHub && isVaultDisconnected && !isOwnedByDashboard,
        // informational step, it follows the withdraw step
        [DISCONNECT_STEP.RECOVER_FEES]: false,
      };

      return buildStepsState(getActiveStep(stepChecks), availableBalance);
    },
  });
};

/**
 * `Step` props for a single step of the disconnect flow. Until the vault state
 * is resolved every step is collapsed and marked as loading.
 */
export const useDisconnectStep = (
  step: DisconnectStep,
): DisconnectStepState => {
  const { data, isPending } = useDisconnectSteps();

  return useMemo(
    () =>
      data?.steps[step] ?? {
        number: step,
        status: isPending ? 'loading' : 'pending',
        isAllowExpand: false,
        defaultExpanded: false,
      },
    [data, isPending, step],
  );
};

/**
 * Overall status of the disconnection, `undefined` until the vault state is
 * resolved.
 */
export const useDisconnectStatus = () => {
  const { data, isLoading, isPending } = useDisconnectSteps();

  return {
    status: data?.status,
    activeStep: data?.activeStep ?? null,
    availableBalance: data?.availableBalance,
    isLoading: isLoading || isPending,
  };
};
