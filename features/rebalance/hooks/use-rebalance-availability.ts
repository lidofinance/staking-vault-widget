import { useMemo } from 'react';

import { useVaultOverviewData, useVaultRiskStatus } from 'modules/vaults';

export type RebalanceAvailability = {
  // There is no outstanding stETH Liability, so there is nothing to rebalance.
  hasNoLiability: boolean;
  // The vault has no idle (Not Staked) availableBalance and the connected wallet cannot
  // fund a rebalance on its own: it is neither the Vault Owner nor holds both
  // the supplier and repayer roles. A supplier-only wallet, for instance, could
  // top up the vault but would not be able to repay, so the action is pointless.
  hasNoAnyFundsToRebalance: boolean;
  // The connected wallet lacks both the rebalancer role and admin (owner) rights.
  hasNoPermission: boolean;
  // Structural cases tied to the absence of outstanding liability / inability to
  // fund a rebalance. Used to hide auxiliary UI (verification banners, supply
  // controls) that would be meaningless in these states.
  isDisabledByNoDebtCases: boolean;
  // Any rebalance-specific reason that makes the form non-actionable.
  isFormDisabled: boolean;
};

/**
 * Centralises the rebalance-specific reasons that make the form non-actionable.
 * Shared between the form wrapper (disabling the form), the verification banners
 * wrapper (hiding banners) and the supply controls (hiding the input/toggle).
 */
export const useRebalanceAvailability = (): RebalanceAvailability => {
  const { data } = useVaultOverviewData();
  const { isVaultOwner, isSupplier, isRebalancer } = useVaultRiskStatus();
  const {
    availableBalanceWei,
    vaultLiabilityStETH: vaultLiability,
    isForceRebalance = false,
  } = data ?? {};

  return useMemo(() => {
    const hasNoLiability = vaultLiability === 0n;

    const canFundRebalance = Boolean(
      isVaultOwner || (isSupplier && isRebalancer),
    );
    const hasNoAnyFundsToRebalance =
      availableBalanceWei === 0n && !canFundRebalance;

    const hasNoPermission = !isForceRebalance && !isVaultOwner && !isRebalancer;

    const isDisabledByNoDebtCases = hasNoLiability || hasNoAnyFundsToRebalance;
    const isFormDisabled = isDisabledByNoDebtCases || hasNoPermission;

    return {
      hasNoLiability,
      hasNoAnyFundsToRebalance,
      hasNoPermission,
      isDisabledByNoDebtCases,
      isFormDisabled,
    };
  }, [
    availableBalanceWei,
    vaultLiability,
    isVaultOwner,
    isSupplier,
    isRebalancer,
    isForceRebalance,
  ]);
};
