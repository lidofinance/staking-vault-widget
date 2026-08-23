import type { FC } from 'react';

import { useVerificationBannerDefender } from './hooks';
import {
  MultipleOwnersWarning,
  NotOwnerWarning,
  UnguaranteedDepositsWarning,
  WithdrawalPermissionWarning,
} from './content';
import type { AdditionalVerificationAction } from './types';

type VerificationBannersProps = {
  action: AdditionalVerificationAction;
  hideWithdrawalPermissionWarning?: boolean;
};

export const VerificationWarningBanners: FC<VerificationBannersProps> = ({
  action,
  hideWithdrawalPermissionWarning,
}) => {
  const state = useVerificationBannerDefender(action);

  return (
    <>
      <NotOwnerWarning state={state} />
      <MultipleOwnersWarning state={state} />
      <UnguaranteedDepositsWarning state={state} />
      {!hideWithdrawalPermissionWarning && (
        <WithdrawalPermissionWarning state={state} />
      )}
    </>
  );
};
