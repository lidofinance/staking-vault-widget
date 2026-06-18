import type { FC } from 'react';

import {
  VerificationErrorBanners,
  VerificationWarningBanners,
} from 'shared/components';

import {
  useRebalanceAvailability,
  useRebalanceState,
} from 'features/rebalance/hooks';

type RebalanceVerificationBannersProps = {
  variant: 'error' | 'warning';
};

export const RebalanceVerificationBanners: FC<
  RebalanceVerificationBannersProps
> = ({ variant }) => {
  const { isForceRebalance } = useRebalanceState();
  const { isDisabledByNoDebtCases } = useRebalanceAvailability();

  if (isDisabledByNoDebtCases || isForceRebalance) {
    return null;
  }

  return variant === 'error' ? (
    <VerificationErrorBanners action="supply" />
  ) : (
    <VerificationWarningBanners action="supply" />
  );
};
