import type { ReactNode } from 'react';
import { useFormState, useWatch } from 'react-hook-form';
import type { ButtonProps } from '@lidofinance/lido-ui';

import { useVault, useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { useVerificationBannerDefender } from 'shared/components';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

import {
  AllEthStakedTooltip,
  DisconnectedTooltip,
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
    when: ({ overviewData }) => overviewData?.vaultLiabilityStETH === 0n,
    tooltip: <ZeroLiabilityTooltip />,
  },
  {
    when: ({ overviewData, hasSupply }) => {
      if (!overviewData) return false;

      const {
        totalValueETH: totalValue,
        vaultLiabilityStETH: vaultLiability,
        availableBalanceWei,
      } = overviewData;

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
  const { isSubmitting, disabled } = useFormState();
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

  const isForceRebalance = overviewData?.isForceRebalance ?? false;

  const tooltip = TOOLTIP_RULES.find(({ when }) =>
    when({ activeVault, overviewData, hasSupply }),
  )?.tooltip;

  const isUnavailable = isErrorBannerVisible || Boolean(tooltip);

  const isDisabled = isSubmitting || disabled;

  const variant = isUnavailable ? 'translucent' : 'filled';
  const color = isUnavailable ? 'secondary' : 'primary';

  const text = isUnavailable
    ? submit.unavailable
    : isForceRebalance
      ? submit.forceRebalance
      : hasSupply
        ? submit.supplyAndRebalance
        : submit.rebalance;

  return { text, tooltip, variant, color, isDisabled, isSubmitting };
};
