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
};

export const VerificationWarningBanners: FC<VerificationBannersProps> = ({
  action,
}) => {
  const state = useVerificationBannerDefender(action);

  return (
    <>
      <NotOwnerWarning state={state} />
      <MultipleOwnersWarning state={state} />
      <UnguaranteedDepositsWarning state={state} />
      <WithdrawalPermissionWarning state={state} />
    </>
  );
};
