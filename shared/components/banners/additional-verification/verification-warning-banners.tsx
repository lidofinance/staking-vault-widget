import type { FC } from 'react';

import { useVerificationBannerDefender } from './hooks';
import {
  MultipleOwnersWarning,
  NotOwnerWarning,
  UnguaranteedDepositsWarning,
  CustodyPermissionWarning,
} from './content';
import type { AdditionalVerificationAction } from './types';

type VerificationBannersProps = {
  action: AdditionalVerificationAction;
  /** rebalance: the `Supply ETH` toggle is off */
  hideCustodyPermissionWarning?: boolean;
};

export const VerificationWarningBanners: FC<VerificationBannersProps> = ({
  action,
  hideCustodyPermissionWarning,
}) => {
  const state = useVerificationBannerDefender(action);

  return (
    <>
      <NotOwnerWarning state={state} />
      <MultipleOwnersWarning state={state} />
      <UnguaranteedDepositsWarning state={state} />
      {!hideCustodyPermissionWarning && (
        <CustodyPermissionWarning state={state} />
      )}
    </>
  );
};
