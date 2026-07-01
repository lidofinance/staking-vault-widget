import type { FC } from 'react';

import { useVerificationBannerDefender } from './hooks';

import type { AdditionalVerificationAction } from './types';
import {
  MultipleOwnersError,
  NotOwnerError,
  UnguaranteedDepositsError,
  UnguaranteedDepositsWarningWithErrors,
} from './content';

type VerificationBannersProps = {
  action: AdditionalVerificationAction;
};

export const VerificationErrorBanners: FC<VerificationBannersProps> = ({
  action,
}) => {
  const state = useVerificationBannerDefender(action);

  return (
    <>
      <NotOwnerError state={state} />
      <MultipleOwnersError state={state} />
      <UnguaranteedDepositsError state={state} />
      <UnguaranteedDepositsWarningWithErrors state={state} />
    </>
  );
};
