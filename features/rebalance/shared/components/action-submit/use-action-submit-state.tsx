import type { ReactNode } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import type { ButtonProps } from '@lidofinance/lido-ui';

import { useVault, useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { useVerificationBannerDefender } from 'shared/components';

import { useIsForceRebalance } from 'features/rebalance/hooks';
import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import {
  AllEthStakedTooltip,
  DisconnectedTooltip,
  ForceInsufficientFundsTooltip,
  PendingConnectTooltip,
  PendingDisconnectTooltip,
  ZeroLiabilityTooltip,
} from './components';

const { submit } = vaultTexts.actions.rebalance;

type TooltipContext = {
  activeVault: ReturnType<typeof useVault>['activeVault'];
  overviewData: ReturnType<typeof useVaultOverviewData>['data'];
  hasSupply: boolean;
};

const TOOLTIP_RULES: {
  when: (ctx: TooltipContext) => boolean;
  tooltip: ReactNode;
}[] = [
  {
    when: ({ activeVault }) => Boolean(activeVault?.isVaultDisconnected),
    tooltip: <DisconnectedTooltip />,
  },
  {
    when: ({ activeVault }) => Boolean(activeVault?.isPendingConnect),
    tooltip: <PendingConnectTooltip />,
  },
  {
    when: ({ activeVault }) => Boolean(activeVault?.isPendingDisconnect),
    tooltip: <PendingDisconnectTooltip />,
  },
  {
    when: ({ overviewData }) => overviewData?.vaultLiability === 0n,
    tooltip: <ZeroLiabilityTooltip />,
  },
  {
    when: ({ overviewData, hasSupply }) => {
      if (!overviewData) return false;

      const { totalValue, vaultLiability, availableBalanceWei } = overviewData;

      // Supplying ETH provides the funds for the rebalance even when the whole
      // availableBalanceWei is staked on validators, so the action stays available.
      return (
        totalValue > 0n &&
        vaultLiability > 0n &&
        availableBalanceWei === 0n &&
        !hasSupply
      );
    },
    tooltip: <AllEthStakedTooltip />,
  },
];

type ActionSubmitState = {
  text: string;
  tooltip?: ReactNode;
  variant: ButtonProps['variant'];
  color: ButtonProps['color'];
  isDisabled: boolean;
  isSubmitting: boolean;
};

export const useActionSubmitState = (): ActionSubmitState => {
  const { isSubmitting, disabled, isValid } = useFormState();
  const [supplyEth, isSupplyEth] = useWatch<
    RebalanceFormFieldValues,
    ['supplyEth', 'isSupplyEth']
  >({
    name: ['supplyEth', 'isSupplyEth'],
  });
  const hasSupply = Boolean(isSupplyEth) && (supplyEth ?? 0n) > 0n;

  const { isErrorBannerVisible } = useVerificationBannerDefender('rebalance');

  const { activeVault } = useVault();
  const { data: overviewData } = useVaultOverviewData();
  const isForceRebalance = useIsForceRebalance();

  // The permissionless forced rebalance spends the Not Staked stVaults Balance,
  // so it reverts (NoFundsForForceRebalance) when that availableBalance cannot cover the
  // shortfall. Block the submission in that case.
  const isForceInsufficientFunds =
    isForceRebalance &&
    !!overviewData &&
    overviewData.availableBalanceWei < overviewData.forceRebalanceThresholdWei;

  const tooltip = isForceInsufficientFunds ? (
    <ForceInsufficientFundsTooltip />
  ) : (
    TOOLTIP_RULES.find(({ when }) =>
      when({ activeVault, overviewData, hasSupply }),
    )?.tooltip
  );

  const isUnavailable = isErrorBannerVisible || Boolean(tooltip);

  const isDisabled =
    isSubmitting ||
    disabled ||
    isForceInsufficientFunds ||
    // Keep submit inactive whenever the form is invalid (empty/over-max amount,
    // unconfirmed verification, etc.).
    !isValid;

  const variant = isUnavailable ? 'translucent' : 'filled';
  const color = isUnavailable ? 'secondary' : 'primary';

  const text = isUnavailable
    ? submit.unavailable
    : isForceRebalance
      ? submit.forceRebalance
      : supplyEth
        ? submit.supplyAndRebalance
        : submit.rebalance;

  return { text, tooltip, variant, color, isDisabled, isSubmitting };
};
