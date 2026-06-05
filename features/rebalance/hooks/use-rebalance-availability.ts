import { useMemo } from 'react';

import {
  useVaultConfirmingRoles,
  useVaultOverviewData,
  useVaultPermission,
  useVaultRiskStatus,
} from 'modules/vaults';

export type RebalanceAvailability = {
  // There is no outstanding stETH Liability, so there is nothing to rebalance.
  hasNoLiability: boolean;
  // The vault has no idle (Not Staked) balance and the connected wallet cannot
  // fund a rebalance on its own: it is neither the Vault Owner nor holds both
  // the supplier and repayer roles. A supplier-only wallet, for instance, could
  // top up the vault but would not be able to repay, so the action is pointless.
  hasNoFundsToRebalance: boolean;
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
  const { isVaultOwner, isSupplier, isRepayer } = useVaultRiskStatus();
  const { hasAdmin } = useVaultConfirmingRoles();
  // The rebalancer role permission already accounts for admin-over-role.
  const { hasPermission: hasRebalancer } = useVaultPermission('rebalancer');

  const { balance, vaultLiability } = data ?? {};

  return useMemo(() => {
    const hasNoLiability = vaultLiability === 0n;

    const canFundRebalance = Boolean(isVaultOwner || (isSupplier && isRepayer));
    const hasNoFundsToRebalance = balance === 0n && !canFundRebalance;

    const hasNoPermission = !hasAdmin && !hasRebalancer;

    const isDisabledByNoDebtCases = hasNoLiability || hasNoFundsToRebalance;
    const isFormDisabled = isDisabledByNoDebtCases || hasNoPermission;

    return {
      hasNoLiability,
      hasNoFundsToRebalance,
      hasNoPermission,
      isDisabledByNoDebtCases,
      isFormDisabled,
    };
  }, [
    balance,
    vaultLiability,
    isVaultOwner,
    isSupplier,
    isRepayer,
    hasAdmin,
    hasRebalancer,
  ]);
};
