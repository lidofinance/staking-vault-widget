import { useFormContext, useFormState } from 'react-hook-form';
import type { ComponentProps } from 'react';
import type { Button } from '@lidofinance/lido-ui';

import { useVault, useVaultOverviewData, vaultTexts } from 'modules/vaults';
import { useVerificationBannerDefender } from 'shared/components';

import { useIsForceRebalance } from 'features/rebalance/hooks';

import type { RebalanceFormFieldValues } from 'features/rebalance/types';

const { submit } = vaultTexts.actions.rebalance;

type TooltipContext = {
  activeVault: ReturnType<typeof useVault>['activeVault'];
  overviewData: ReturnType<typeof useVaultOverviewData>['data'];
};

const TOOLTIP_RULES: {
  when: (ctx: TooltipContext) => boolean;
  tooltip: string;
}[] = [
  {
    when: ({ activeVault }) => Boolean(activeVault?.isVaultDisconnected),
    tooltip: submit.tooltips.disconnected,
  },
  {
    when: ({ activeVault }) => Boolean(activeVault?.isPendingConnect),
    tooltip: submit.tooltips.pendingConnect,
  },
  {
    when: ({ activeVault }) => Boolean(activeVault?.isPendingDisconnect),
    tooltip: submit.tooltips.pendingDisconnect,
  },
  {
    when: ({ overviewData }) => overviewData?.vaultLiability === 0n,
    tooltip: submit.tooltips.zeroLiability,
  },
];

type ButtonProps = ComponentProps<typeof Button>;

type ActionSubmitState = {
  text: string;
  tooltip?: string;
  variant: ButtonProps['variant'];
  color: ButtonProps['color'];
  isDisabled: boolean;
  isSubmitting: boolean;
};

export const useActionSubmitState = (): ActionSubmitState => {
  const { watch } = useFormContext<RebalanceFormFieldValues>();
  const { isSubmitting, disabled, isValid } = useFormState();
  const supplyEth = watch('supplyEth');

  const { isErrorBannerVisible, isWarningBannerVisible } =
    useVerificationBannerDefender('rebalance');

  const { activeVault } = useVault();
  const { data: overviewData } = useVaultOverviewData();
  const isForceRebalance = useIsForceRebalance();

  const tooltip = TOOLTIP_RULES.find(({ when }) =>
    when({ activeVault, overviewData }),
  )?.tooltip;

  const isUnavailable = isErrorBannerVisible || Boolean(tooltip);

  const isDisabled =
    isSubmitting || disabled || (isWarningBannerVisible && !isValid);

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
